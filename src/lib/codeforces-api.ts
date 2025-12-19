
const CF_API_BASE_URL = 'https://codeforces.com/api';

// Type for the result from the user.info API call
interface CFUserInfo {
  handle: string;
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  // Add other fields as needed
}

// Type for the result from the user.rating API call
interface CFRatingChange {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

async function fetchFromCodeforcesAPI(url: string, errorMessage: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Codeforces API request failed with status ${response.status}: ${errorMessage}`);
  }

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error(`Received an invalid non-JSON response from Codeforces API. The API may be down or rate-limiting requests.`);
  }

  const data = await response.json();
  if (data.status !== 'OK') {
    throw new Error(data.comment || errorMessage);
  }

  return data.result;
}


/**
 * Fetches user information from the Codeforces API.
 * @param handle The Codeforces handle of the user.
 * @returns A promise that resolves to the user's information.
 */
export async function getUserInfo(handle: string): Promise<CFUserInfo> {
  const url = `${CF_API_BASE_URL}/user.info?handles=${handle}`;
  const result = await fetchFromCodeforcesAPI(url, 'Failed to fetch user info from Codeforces API.');
  // The result is an array, we want the first element
  return result[0];
}

/**
 * Fetches the rating history for a user from the Codeforces API.
 * @param handle The Codeforces handle of the user.
 * @returns A promise that resolves to an array of rating changes.
 */
export async function getUserRatingHistory(handle: string): Promise<CFRatingChange[]> {
  const url = `${CF_API_BASE_URL}/user.rating?handle=${handle}`;
  return fetchFromCodeforcesAPI(url, 'Failed to fetch user rating history from Codeforces API.');
}

// Type for a contest from the contest.list API call
interface CFContest {
  id: number;
  name: string;
  type: 'CF' | 'IOI' | 'ICPC';
  phase: 'BEFORE' | 'CODING' | 'PENDING_SYSTEM_TEST' | 'SYSTEM_TEST' | 'FINISHED';
  frozen: boolean;
  durationSeconds: number;
  startTimeSeconds: number;
}

/**
 * Fetches the list of all contests from the Codeforces API.
 * @returns A promise that resolves to an array of contests.
 */
export async function getContestList(): Promise<CFContest[]> {
    const url = `${CF_API_BASE_URL}/contest.list`;
    return fetchFromCodeforcesAPI(url, 'Failed to fetch contest list from Codeforces API.');
}
