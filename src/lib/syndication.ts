import { prisma } from './prisma';
import crypto from 'crypto';

export interface SyndicationReport {
  indexNow: { success: boolean; message: string };
  twitter: { success: boolean; message: string; skipped?: boolean };
  facebook: { success: boolean; message: string; skipped?: boolean };
  pinterest: { success: boolean; message: string; skipped?: boolean };
}

/**
 * Generates an OAuth 1.0a Authorization header for Twitter / X API v2
 */
function getTwitterOAuthHeader(
  method: string,
  url: string,
  consumerKey: string,
  consumerSecret: string,
  accessToken: string,
  tokenSecret: string
): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: '1.0',
  };

  const sortedKeys = Object.keys(oauthParams).sort();
  const paramString = sortedKeys
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(oauthParams[k])}`)
    .join('&');

  const signatureBase = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(paramString)}`;
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
  const signature = crypto.createHmac('sha1', signingKey).update(signatureBase).digest('base64');

  oauthParams['oauth_signature'] = signature;

  const headerParts = Object.keys(oauthParams)
    .sort()
    .map((k) => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`);

  return `OAuth ${headerParts.join(', ')}`;
}

/**
 * Instant Search Engine Indexing via IndexNow Protocol (Bing, Yandex, Yahoo, Naver)
 */
export async function pushToIndexNow(urls: string[]): Promise<{ success: boolean; message: string }> {
  if (!urls || urls.length === 0) {
    return { success: false, message: 'No URLs provided for indexing' };
  }

  try {
    const settings = await prisma.systemSetting.findUnique({ where: { id: 'global' } });
    const host = process.env.NEXT_PUBLIC_SITE_URL
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL).host
      : 'ticketfixture.com';

    const indexNowKey = settings?.indexNowKey || process.env.INDEXNOW_KEY || 'TicketFixture-indexnow-2026-key';

    const payload = {
      host,
      key: indexNowKey,
      keyLocation: `https://${host}/${indexNowKey}.txt`,
      urlList: urls,
    };

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 200 || response.status === 202) {
      return {
        success: true,
        message: `Successfully pushed ${urls.length} URLs to IndexNow (Bing/Yahoo). HTTP ${response.status}`,
      };
    } else {
      const errText = await response.text();
      return {
        success: false,
        message: `IndexNow responded with status ${response.status}: ${errText}`,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `IndexNow request failed: ${err.message || err}`,
    };
  }
}

/**
 * Syndicates a published post to Twitter / X
 */
export async function sharePostToTwitter(post: {
  title: string;
  slug: string;
  sport: string;
}): Promise<{ success: boolean; message: string; skipped?: boolean }> {
  try {
    const settings = await prisma.systemSetting.findUnique({ where: { id: 'global' } });
    const apiKey = settings?.twitterApiKey || process.env.TWITTER_API_KEY;
    const apiSecret = settings?.twitterApiSecret || process.env.TWITTER_API_SECRET;
    const accessToken = settings?.twitterAccessToken || process.env.TWITTER_ACCESS_TOKEN;
    const accessSecret = settings?.twitterAccessSecret || process.env.TWITTER_ACCESS_SECRET;

    if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
      return {
        success: false,
        skipped: true,
        message: 'Twitter / X credentials not configured in Admin Settings.',
      };
    }

    const siteUrl = process.env.NEXTAUTH_URL || 'https://ticketfixture.com';
    const postUrl = `${siteUrl}/post/${post.slug}`;
    const sportTag = post.sport.toUpperCase().replace(/[^A-Z0-9]/g, '');

    const tweetText = `⚡ Broadcast Guide: ${post.title.slice(0, 150)}\n\nConfirmed TV channels & live streaming passes:\n${postUrl}\n\n#${sportTag} #LiveSports #SportsStream`;

    const url = 'https://api.twitter.com/2/tweets';
    const authHeader = getTwitterOAuthHeader('POST', url, apiKey, apiSecret, accessToken, accessSecret);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: tweetText }),
    });

    const data = await response.json();
    if (response.ok && data?.data?.id) {
      return { success: true, message: `Tweet published! ID: ${data.data.id}` };
    } else {
      return {
        success: false,
        message: `Twitter API Error: ${data?.detail || JSON.stringify(data)}`,
      };
    }
  } catch (err: any) {
    return { success: false, message: `Twitter syndication failed: ${err.message || err}` };
  }
}

/**
 * Syndicates a published post to Facebook Page
 */
export async function sharePostToFacebook(post: {
  title: string;
  slug: string;
  summary: string;
}): Promise<{ success: boolean; message: string; skipped?: boolean }> {
  try {
    const settings = await prisma.systemSetting.findUnique({ where: { id: 'global' } });
    const pageId = settings?.facebookPageId || process.env.FACEBOOK_PAGE_ID;
    const accessToken = settings?.facebookAccessToken || process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!pageId || !accessToken) {
      return {
        success: false,
        skipped: true,
        message: 'Facebook Page credentials not configured in Admin Settings.',
      };
    }

    const siteUrl = process.env.NEXTAUTH_URL || 'https://ticketfixture.com';
    const postUrl = `${siteUrl}/post/${post.slug}`;

    const url = `https://graph.facebook.com/v19.0/${pageId}/feed`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `⚡ ${post.title}\n\n${post.summary}\n\nFind verified matchday channels & streams here:`,
        link: postUrl,
        access_token: accessToken,
      }),
    });

    const data = await response.json();
    if (response.ok && data?.id) {
      return { success: true, message: `Facebook Post published! ID: ${data.id}` };
    } else {
      return {
        success: false,
        message: `Facebook API Error: ${data?.error?.message || JSON.stringify(data)}`,
      };
    }
  } catch (err: any) {
    return { success: false, message: `Facebook syndication failed: ${err.message || err}` };
  }
}

/**
 * Syndicates a published post to Pinterest
 */
export async function sharePostToPinterest(post: {
  title: string;
  slug: string;
  summary: string;
  featuredImage?: string | null;
}): Promise<{ success: boolean; message: string; skipped?: boolean }> {
  try {
    const settings = await prisma.systemSetting.findUnique({ where: { id: 'global' } });
    const accessToken = settings?.pinterestAccessToken || process.env.PINTEREST_ACCESS_TOKEN;
    const boardId = settings?.pinterestBoardId || process.env.PINTEREST_BOARD_ID;

    if (!accessToken || !boardId) {
      return {
        success: false,
        skipped: true,
        message: 'Pinterest credentials not configured in Admin Settings.',
      };
    }

    const siteUrl = process.env.NEXTAUTH_URL || 'https://ticketfixture.com';
    const postUrl = `${siteUrl}/post/${post.slug}`;
    const imageUrl = post.featuredImage || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80';

    const url = 'https://api.pinterest.com/v5/pins';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: post.title.slice(0, 100),
        description: `${post.summary.slice(0, 450)} Verified broadcasting guide.`,
        link: postUrl,
        board_id: boardId,
        media_source: {
          source_type: 'image_url',
          url: imageUrl,
        },
      }),
    });

    const data = await response.json();
    if (response.ok && data?.id) {
      return { success: true, message: `Pinterest Pin published! ID: ${data.id}` };
    } else {
      return {
        success: false,
        message: `Pinterest API Error: ${data?.message || JSON.stringify(data)}`,
      };
    }
  } catch (err: any) {
    return { success: false, message: `Pinterest syndication failed: ${err.message || err}` };
  }
}

/**
 * Master dispatcher: Syndicates a post to all enabled channels and updates DB flags
 */
export async function syndicatePost(postId: string): Promise<SyndicationReport> {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    throw new Error('Post not found');
  }

  const siteUrl = process.env.NEXTAUTH_URL || 'https://ticketfixture.com';
  const postUrl = `${siteUrl}/post/${post.slug}`;

  // 1. IndexNow Push
  const indexNowResult = await pushToIndexNow([postUrl]);

  // 2. Twitter / X
  const twitterResult = await sharePostToTwitter(post);

  // 3. Facebook
  const fbResult = await sharePostToFacebook(post);

  // 4. Pinterest
  const pinResult = await sharePostToPinterest(post);

  // Update DB flags
  await prisma.post.update({
    where: { id: postId },
    data: {
      indexedBing: indexNowResult.success ? true : post.indexedBing,
      indexedAt: indexNowResult.success ? new Date() : post.indexedAt,
      sharedTwitter: twitterResult.success ? true : post.sharedTwitter,
      sharedFacebook: fbResult.success ? true : post.sharedFacebook,
      sharedPinterest: pinResult.success ? true : post.sharedPinterest,
    },
  });

  return {
    indexNow: indexNowResult,
    twitter: twitterResult,
    facebook: fbResult,
    pinterest: pinResult,
  };
}
