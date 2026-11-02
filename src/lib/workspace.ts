export interface ContactInfo {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
}

/**
 * Fetches connections from Google People API
 */
export async function fetchGoogleContacts(token: string): Promise<ContactInfo[]> {
  try {
    const response = await fetch(
      'https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,photos&pageSize=80',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Google People API return error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    const connections = data.connections || [];
    return connections.map((conn: any, index: number) => {
      const nameObj = conn.names?.[0] || {};
      const emailObj = conn.emailAddresses?.[0] || {};
      const photoObj = conn.photos?.[0] || {};
      return {
        id: conn.resourceName || `contact_${index}`,
        name: nameObj.displayName || 'Unnamed Contact',
        email: emailObj.value || '',
        photoUrl: photoObj.url || undefined,
      };
    }).filter((c: ContactInfo) => c.email !== '');
  } catch (error) {
    console.error('fetchGoogleContacts error:', error);
    throw error;
  }
}

/**
 * Dispatches an email via client-side Gmail REST API
 */
export async function sendGmailEmail(
  token: string,
  to: string,
  subject: string,
  bodyTextHTML: string
): Promise<any> {
  const str = [
    `To: ${to}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    bodyTextHTML,
  ].join('\r\n');
  
  // RFC 2822 websafe base64 conversion
  const encodedEmail = btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  try {
    const response = await fetch(
      'https://gmail.googleapis.com/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: encodedEmail,
        }),
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gmail API response error ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('sendGmailEmail error:', error);
    throw error;
  }
}
