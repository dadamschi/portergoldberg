/**
 * Simple email signature for bulk emails
 */
export const EMAIL_SIGNATURE_HTML = `<div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #333; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
  <p style="margin: 0 0 4px 0;"><strong>PorterGoldberg Residential</strong></p>
  <p style="margin: 0 0 4px 0;">Jameson Sotheby's International Realty</p>
  <p style="margin: 0 0 4px 0;">425 W. North Avenue | Chicago, IL 60610</p>
  <p style="margin: 0 0 12px 0;">
    <a href="https://www.portergoldberg.com" style="color: #15c; text-decoration: none;">portergoldberg.com</a>
  </p>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0;">
    <tr>
      <td style="padding-right: 12px;">
        <a href="https://www.instagram.com/portergoldbergchicago" target="_blank" style="text-decoration: none;">
          <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" width="24" height="24" style="display: block; border: 0;">
        </a>
      </td>
      <td style="padding-right: 12px;">
        <a href="https://www.facebook.com/PorterGoldbergResidential" target="_blank" style="text-decoration: none;">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="24" height="24" style="display: block; border: 0;">
        </a>
      </td>
    </tr>
  </table>
</div>`

/**
 * Footer HTML using fluid-hybrid technique
 * - Agent cards stack on mobile
 * - Social icons only (no text labels)
 */
export const FOOTER_HTML = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#000000;border-collapse:collapse;">

  <!-- Top band: white, PORTERGOLDBERG.COM centered with gold rules -->
  <tr>
    <td style="padding:0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:20px 18px;">
          <a href="https://www.portergoldberg.com" target="_blank" style="text-decoration:none;display:block;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="vertical-align:middle;"><div style="height:1px;background-color:#A8904E;font-size:0;line-height:0;">&nbsp;</div></td>
                <td style="width:1%;white-space:nowrap;padding:0 16px;text-align:center;vertical-align:middle;"><span style="font-size:16px;font-weight:bold;letter-spacing:3px;color:#A8904E;text-transform:uppercase;">PORTERGOLDBERG.COM</span></td>
                <td style="vertical-align:middle;"><div style="height:1px;background-color:#A8904E;font-size:0;line-height:0;">&nbsp;</div></td>
              </tr>
            </table>
          </a>
        </td></tr>
      </table>
    </td>
  </tr>

  <!-- Agents: fluid-hybrid two cards -->
  <tr>
    <td style="padding:16px 10px;background-color:#000000;border-top:1px solid #444444;border-bottom:1px solid #444444;">
      <div style="font-size:0;line-height:0;text-align:center;">
        <!--[if mso]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td width="270" valign="top"><![endif]-->
        <div style="display:inline-block;vertical-align:top;width:270px;max-width:100%;text-align:left;line-height:1.4;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0 auto;">
            <tr>
              <td style="padding:6px 12px 6px 0;vertical-align:middle;"><img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Email%20Footer%20Headshot%20-%20sporter.png" alt="Samantha Porter" width="58" style="display:block;border:0;"></td>
              <td style="vertical-align:middle;font-family:Helvetica,Arial,sans-serif;">
                <p style="margin:0;font-size:14px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#ffffff;">Samantha Porter</p>
                <p style="margin:0 0 2px 0;font-size:12px;color:#ffffff;">Vice President, Sales</p>
                <p style="margin:0;font-size:12px;"><a href="tel:7739887898" style="color:#ffffff;text-decoration:none;">773-988-7898</a></p>
                <p style="margin:0;font-size:12px;"><a href="mailto:samantha@portergoldberg.com" style="color:#ffffff;text-decoration:none;">samantha@portergoldberg.com</a></p>
              </td>
            </tr>
          </table>
        </div><!--
        --><!--[if mso]></td><td width="270" valign="top"><![endif]-->
        <div style="display:inline-block;vertical-align:top;width:270px;max-width:100%;text-align:left;line-height:1.4;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0 auto;">
            <tr>
              <td style="padding:6px 12px 6px 0;vertical-align:middle;"><img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Email%20Footer%20Headshot%20-%20lgoldberg.png" alt="Lauren Goldberg" width="58" style="display:block;border:0;"></td>
              <td style="vertical-align:middle;font-family:Helvetica,Arial,sans-serif;">
                <p style="margin:0;font-size:14px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#ffffff;">Lauren Goldberg</p>
                <p style="margin:0 0 2px 0;font-size:12px;color:#ffffff;">Vice President, Sales</p>
                <p style="margin:0;font-size:12px;"><a href="tel:7735760053" style="color:#ffffff;text-decoration:none;">773-576-0053</a></p>
                <p style="margin:0;font-size:12px;"><a href="mailto:lauren@portergoldberg.com" style="color:#ffffff;text-decoration:none;">lauren@portergoldberg.com</a></p>
              </td>
            </tr>
          </table>
        </div>
        <!--[if mso]></td></tr></table><![endif]-->
      </div>
    </td>
  </tr>

  <!-- Logo, linked -->
  <tr>
    <td style="padding:16px 10px;text-align:center;background-color:#000000;">
      <a href="https://www.portergoldberg.com" target="_blank" style="text-decoration:none;display:inline-block;">
        <img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Email%20Header%20PGJameson%20logo.png" alt="PorterGoldberg Residential" height="110" style="display:block;border:0;">
      </a>
    </td>
  </tr>

  <!-- Social: icon images only -->
  <tr>
    <td style="padding:12px 10px 14px 10px;background-color:#000000;">
      <table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
        <tr>
          <td style="padding:0 12px;">
            <a href="https://www.instagram.com/portergoldbergchicago" target="_blank" style="text-decoration:none;">
              <img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Instagram_Glyph_White.png" alt="Instagram" width="26" height="26" style="display:block;border:0;">
            </a>
          </td>
          <td style="padding:0 12px;">
            <a href="https://www.facebook.com/PorterGoldbergResidential" target="_blank" style="text-decoration:none;">
              <img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Facebook_Logo_Secondary.png" alt="Facebook" width="26" height="26" style="display:block;border:0;">
            </a>
          </td>
          <td style="padding:0 12px;">
            <a href="https://www.youtube.com/@PorterGoldbergResidential" target="_blank" style="text-decoration:none;">
              <img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Email%20Footer%20YouTube%20Logo.png" alt="YouTube" width="26" height="26" style="display:block;border:0;">
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Legal disclaimer -->
  <tr>
    <td style="padding:10px 14px 16px 14px;background-color:#000000;">
      <p style="margin:0;font-size:10px;color:#ffffff;line-height:1.4;text-align:center;font-family:Arial,sans-serif;">
        &copy; ${new Date().getFullYear()} Sotheby&rsquo;s International Realty&reg; and the Sotheby&rsquo;s International Realty Logo are service marks licensed to Sotheby&rsquo;s International Realty Affiliates LLC and used with permission. Jameson Sotheby&rsquo;s International Realty fully supports the principles of the Fair Housing Act and the Equal Opportunity Act. Each franchise is independently owned and operated. Any services or products provided by independently owned and operated franchisees are not provided by, affiliated with or related to Sotheby&rsquo;s International Realty Affiliates LLC nor any of its affiliated companies.
      </p>
    </td>
  </tr>

</table>`