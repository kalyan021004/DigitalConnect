export const sendEmail = async (to, subject, html) => {
  console.log("📧 EMAIL PREVIEW");
  console.log("To:", to);
  console.log("Subject:", subject);
  console.log("Body:", html);

  // return preview data
  return {
    to,
    subject,
    html,
    preview: true
  };
};
