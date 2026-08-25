import PolicyPageTemplate from "../components/templates/PolicyPageTemplate";

export const metadata = {
  title: "Privacy Policy — SimplePlan Media",
};

// Static legal content — see PolicyPageTemplate.js for the reusable
// layout (Wayfinding rail, numbering, CTA) this and any future policy
// page (e.g. Terms & Conditions) both share. To add another page of this
// type, copy this file, change the route folder, and swap `sections`.
const SECTIONS = [
  {
    id: "intellectual-property",
    label: "Intellectual Property Rights",
    body: [
      {
        type: "p",
        text: "Other than the content you own, under these Terms, Foto Owl and/or its licensors own all the intellectual property rights and materials contained in this Website.",
      },
      {
        type: "p",
        text: "You are granted limited license only for purposes of viewing the material contained on this Website.",
      },
    ],
  },
  {
    id: "restrictions",
    label: "Restrictions",
    body: [
      { type: "p", text: "Users are restricted from all of the following:" },
      {
        type: "ul",
        items: [
          "Publishing any Website material in any other media",
          "Selling, sublicensing and/or otherwise commercializing any Website material",
          "Publicly performing and/or showing any Website material",
          "Using this Website in any way that is or may be damaging to this Website",
          "Using this Website in any way that impacts user access to this Website",
          "Using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity",
          "Engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website",
          "Using this Website to engage in any advertising or marketing.",
        ],
      },
      {
        type: "p",
        text: "Certain areas of this Website are restricted from being accessed by you and Foto Owl may further restrict access by you to any areas of this Website, at any time, in absolute discretion. Any user ID and password you may have for this Website are confidential and you must maintain confidentiality as well.",
      },
    ],
  },
  {
    id: "your-content",
    label: "Your Content",
    body: [
      {
        type: "p",
        text: "In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text, images or other material that you choose to display on this website. By displaying your content, you grant Foto Owl a non-exclusive, worldwide irrevocable, sub-licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.",
      },
      {
        type: "p",
        text: "Your Content must be your own and must not be invading any third-party's rights. Foto Owl reserves the right to remove any of your Content from this website at any time without notice.",
      },
    ],
  },
  {
    id: "your-privacy",
    label: "Your Privacy",
    body: [{ type: "p", text: "Please read Privacy Policy." }],
  },
  {
    id: "no-warranties",
    label: "No Warranties",
    body: [
      {
        type: "p",
        text: "This Website is provided “as is,” with all faults, and Foto Owl expresses no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you.",
      },
    ],
  },
  {
    id: "limitation-of-liability",
    label: "Limitation Of Liability",
    body: [
      {
        type: "p",
        text: "In no event shall Foto Owl, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. Foto Owl, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.",
      },
    ],
  },
  {
    id: "indemnification",
    label: "Indemnification",
    body: [
      {
        type: "p",
        text: "You hereby indemnify to the fullest extent Foto Owl from and against any and/or all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these Terms.",
      },
    ],
  },
  {
    id: "severability",
    label: "Severability",
    body: [
      {
        type: "p",
        text: "If any provision of these Terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein.",
      },
    ],
  },
  {
    id: "variation-of-terms",
    label: "Variation Of Terms",
    body: [
      {
        type: "p",
        text: "Foto Owl is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis.",
      },
    ],
  },
  {
    id: "assignment",
    label: "Assignment",
    body: [
      {
        type: "p",
        text: "The Foto Owl is allowed to assign, transfer, and subcontract its rights and/or obligations under these Terms without any notification. However, you are not allowed to assign, transfer, or subcontract any of your rights and/or obligations under these Terms.",
      },
    ],
  },
  {
    id: "entire-agreement",
    label: "Entire Agreement",
    body: [
      {
        type: "p",
        text: "These Terms constitute the entire agreement between Foto Owl and you in relation to your use of this Website, and supersede all prior agreements and understandings.",
      },
    ],
  },
  {
    id: "governing-law",
    label: "Governing Law & Jurisdiction",
    body: [
      {
        type: "p",
        text: "These Terms will be governed by and interpreted in accordance with the laws of the State of in, and you submit to the non-exclusive jurisdiction of the state and federal courts located in for the resolution of any disputes.",
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
  return <PolicyPageTemplate title="Privacy Policy" lastUpdated="January 2026" sections={SECTIONS} />;
}
