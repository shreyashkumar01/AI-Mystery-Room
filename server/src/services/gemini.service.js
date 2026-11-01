import { getGeminiClient, getGeminiModelName } from "../config/gemini.js";
import { buildMysteryPrompt } from "../prompts/mystery.prompt.js";
import { validateGeneratedMystery, DIFFICULTY_CONFIG } from "../validators/case.validator.js";

/**
 * Service to generate mysteries using Google Gemini API or intelligent offline fallback
 */
export const generateMysteryWithGemini = async (premise, difficulty, maxRetries = 3) => {
  const gemini = getGeminiClient();
  const modelName = getGeminiModelName();

  // If no Gemini API key is configured, supply dynamic fallback case tailored to premise
  if (!gemini) {
    console.warn("[GeminiService] No GEMINI_API_KEY detected. Using deterministic dynamic generator.");
    return generateDynamicOfflineCase(premise, difficulty);
  }

  let attempt = 0;
  let lastError = null;
  let correctiveNotes = "";

  while (attempt < maxRetries) {
    attempt++;
    try {
      console.log(`[GeminiService] Attempt ${attempt}/${maxRetries} generating mystery for difficulty '${difficulty}'...`);

      const model = gemini.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7
        }
      });

      let prompt = buildMysteryPrompt(premise, difficulty);
      if (correctiveNotes) {
        prompt += `\n\nCRITICAL FIXES REQUIRED FROM PREVIOUS FAILED VALIDATION:\n${correctiveNotes}\nPlease fix all listed errors and follow the counts strictly.`;
      }

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Clean response text in case markdown formatting leaked
      const cleaned = responseText
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();

      const parsedJson = JSON.parse(cleaned);

      // Deep structural and logical validation
      const validatedCase = validateGeneratedMystery(parsedJson, difficulty);
      console.log(`[GeminiService] Successfully generated and validated mystery: "${validatedCase.title}"`);
      return validatedCase;
    } catch (err) {
      console.error(`[GeminiService] Attempt ${attempt} failed:`, err.message);
      lastError = err;
      correctiveNotes = err.validationDetails ? err.validationDetails.join("\n- ") : err.message;
    }
  }

  console.warn("[GeminiService] All Gemini retries exhausted. Falling back to dynamic case generator.");
  return generateDynamicOfflineCase(premise, difficulty);
};

/**
 * Deterministic Dynamic Case Generator when Gemini API is unconfigured or unavailable
 */
export const generateDynamicOfflineCase = (premise, difficulty) => {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
  const isMurder = premise.toLowerCase().includes("dead") || premise.toLowerCase().includes("mansion") || premise.toLowerCase().includes("party");

  const victimName = isMurder ? "Arthur Pendelton" : "Helena Vance";
  const victimRole = isMurder ? "Tech Magnate & Philanthropist" : "Chief Curator";

  const allSuspects = [
    {
      suspectId: "SUSPECT_01",
      name: "Marcus Sterling",
      age: 42,
      occupation: "Chief Financial Officer",
      relationship: "Business Partner",
      background: "Has overseen company accounts for 9 years. Known for meticulous records and mounting personal debts.",
      motive: "Audits were uncovering an embezzlement scheme of $2.4M directly linked to his Cayman accounts.",
      alibi: "Claims he was in the conservatory making business calls from 21:45 to 22:30.",
      statement: "I arrived with the quarterly balance sheet. Arthur and I spoke briefly, then I took calls in the conservatory until the alarm sounded.",
      publicDescription: "A sharp-dressed executive clutching a leather briefcase. His watch hands tremble slightly.",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
    },
    {
      suspectId: "SUSPECT_02",
      name: "Eleanor Vance",
      age: 38,
      occupation: "Head of Security & Estate Logistics",
      relationship: "Confidante & Security Specialist",
      background: "Former intelligence contractor hired 3 years ago to modernize estate access controls.",
      motive: "Was recently notified that her private contract was being terminated without severance.",
      alibi: "Claims she was monitoring the security terminal in the East Wing server room.",
      statement: "I noticed a brief camera glitch at 22:15, but dismissed it as an automated sensor reboot.",
      publicDescription: "Stoic, wearing a high-collared utility blazer. Kept checking her smartwatch during questioning.",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
    },
    {
      suspectId: "SUSPECT_03",
      name: "Julian Thorne",
      age: 29,
      occupation: "Lead Research Scientist",
      relationship: "Protégé & Lead Patent Developer",
      background: "Brilliant geneticist whose breakthrough patent was registered entirely under the victim's name.",
      motive: "Furious over being cut out of royalties worth tens of millions.",
      alibi: "Claims he was walking near the hedge maze seeking fresh air.",
      statement: "Arthur betrayed our agreement. But I would never resort to violence; I had already retained patent attorneys.",
      publicDescription: "Disheveled hair, lab coat over a formal vest. Smells faintly of botanical solvents.",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80"
    },
    {
      suspectId: "SUSPECT_04",
      name: "Dr. Evelyn Drake",
      age: 51,
      occupation: "Personal Physician",
      relationship: "Long-time Physician & Family Friend",
      background: "Administered the victim's medication regimens for over a decade.",
      motive: "The victim was about to report Dr. Drake to the medical ethics committee for fraudulent billing.",
      alibi: "Claims she was preparing evening medication in the pantry clinic.",
      statement: "Arthur's vitals were stable when I checked him at 21:30. I left his medicine vials sealed in the study cabinet.",
      publicDescription: "Poised and guarded, holding medical notes with annotated pharmaceutical dosages.",
      avatarUrl: "https://images.unsplash.com/photo-1594824813583-02f5e3962b32?w=400&auto=format&fit=crop&q=80"
    },
    {
      suspectId: "SUSPECT_05",
      name: "Victor Corvo",
      age: 33,
      occupation: "Private Art Dealer & Valet",
      relationship: "Personal Valet",
      background: "Has deep connections to black-market antiquities and high-stakes underground gambling.",
      motive: "Discovered an original Renaissance manuscript in the study safe that could clear his gambling debts.",
      alibi: "Claims he was in the wine cellar selecting a vintage for the midnight toast.",
      statement: "I was uncorking the 1982 Bordeaux. You can check the cellar inventory logs; I never went near the study balcony.",
      publicDescription: "Wearing white serving gloves that appear freshly replaced. A subtle scar runs beneath his left collar.",
      avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80"
    }
  ];

  // Slice suspects strictly matching difficulty count
  const suspects = allSuspects.slice(0, config.suspects);

  // Culprit is consistently SUSPECT_01 (Marcus Sterling) in the deterministic fallback
  const culprit = suspects[0];

  const allClues = [
    {
      clueId: "CLUE_01",
      title: "Encrypted Wire Transfer Confirmation",
      description: "A shredded slip retrieved from the study wastebasket shows an offshore wire transfer authorization dated tonight at 22:12.",
      type: "digital",
      evidenceId: "EVIDENCE_01",
      importance: "critical",
      relatedSuspects: ["SUSPECT_01"],
      discoveryText: "The transfer details match Marcus Sterling's secret Cayman account routing numbers!",
      solutionExplanation: "Marcus forced Arthur to authorize the transfer before terminating him to prevent disclosure."
    },
    {
      clueId: "CLUE_02",
      title: "Cell Tower Signal Timestamp",
      description: "Marcus claimed he was on phone calls in the conservatory, but telecom logs show his phone pinged the internal study repeater at 22:14.",
      type: "digital",
      evidenceId: "EVIDENCE_02",
      importance: "critical",
      relatedSuspects: ["SUSPECT_01"],
      discoveryText: "Marcus's alibi is shattered: he was inside the study at the exact moment of the incident!",
      solutionExplanation: "The internal repeater log confirms Marcus was present in the crime scene room."
    },
    {
      clueId: "CLUE_03",
      title: "Security Feed Micro-Loop",
      description: "The CCTV corridor camera outside the study experienced a 4-minute frozen loop precisely between 22:11 and 22:15.",
      type: "forensic",
      evidenceId: "EVIDENCE_03",
      importance: "critical",
      relatedSuspects: ["SUSPECT_01", "SUSPECT_02"],
      discoveryText: "The loop was manually triggered using an executive bypass code issued only to Marcus Sterling!",
      solutionExplanation: "Marcus used his corporate override keycard to freeze the camera loop while slipping inside."
    },
    {
      clueId: "CLUE_04",
      title: "Shattered Crystal Tumbler",
      description: "Traces of potassium cyanide and vintage Scotch found in the victim's personal tumbler.",
      type: "physical",
      evidenceId: "EVIDENCE_04",
      importance: "supporting",
      relatedSuspects: ["SUSPECT_01", "SUSPECT_04"],
      discoveryText: "Only someone invited into the inner study could have poured the drink without struggle.",
      solutionExplanation: "Arthur invited Marcus in to discuss business, unaware of the lethal poison."
    },
    {
      clueId: "CLUE_05",
      title: "Red Herring: Discarded Medical Ampoule",
      description: "An empty sedative vial belonging to Dr. Drake was found behind the hallway credenza.",
      type: "physical",
      evidenceId: "EVIDENCE_04",
      importance: "misleading",
      relatedSuspects: ["SUSPECT_04"],
      discoveryText: "Dr. Drake dropped the ampoule during the initial emergency resuscitation attempt.",
      solutionExplanation: "A red herring: Dr. Drake attempted CPR when the alarm sounded, dropping her emergency kit."
    },
    {
      clueId: "CLUE_06",
      title: "Patent Royalty Dispute Letters",
      description: "Heated legal correspondence between Julian Thorne and Arthur Pendelton regarding intellectual property rights.",
      type: "documentary",
      evidenceId: "EVIDENCE_04",
      importance: "misleading",
      relatedSuspects: ["SUSPECT_03"],
      discoveryText: "Letters prove motive, but Julian's attorney confirms formal arbitration was signed earlier that afternoon.",
      solutionExplanation: "Julian had already initiated legal proceedings and had no motive to commit murder that night."
    },
    {
      clueId: "CLUE_07",
      title: "Security Master Keycard Access Log",
      description: "Server room access records confirm Eleanor was logged into the physical terminal rebooting network switches.",
      type: "digital",
      evidenceId: "EVIDENCE_03",
      importance: "supporting",
      relatedSuspects: ["SUSPECT_02"],
      discoveryText: "Eleanor's terminal presence corroborates her statement; she was not at the study.",
      solutionExplanation: "Eleanor was genuinely troubleshooting network drops, ruling her out as the intruder."
    },
    {
      clueId: "CLUE_08",
      title: "Vintage Wine Cellar Inventory Sheet",
      description: "Dust patterns on the 1982 Bordeaux rack confirm Victor Corvo was in the sub-cellar during the murder.",
      type: "physical",
      evidenceId: "EVIDENCE_04",
      importance: "supporting",
      relatedSuspects: ["SUSPECT_05"],
      discoveryText: "Victor's fingerprints on the cellar lock match the exact time of the murder.",
      solutionExplanation: "Victor was indeed in the cellar looking for high-value bottles, exonerating him."
    },
    {
      clueId: "CLUE_09",
      title: "Marcus Sterling's Torn Cufflink",
      description: "A monogrammed gold cufflink with 'M.S.' engravings discovered wedged under the heavy mahogany study desk.",
      type: "physical",
      evidenceId: "EVIDENCE_04",
      importance: "critical",
      relatedSuspects: ["SUSPECT_01"],
      discoveryText: "Physical forensic proof linking Marcus Sterling directly to the struggle at the desk!",
      solutionExplanation: "Torn off as Arthur resisted, irrefutably confirming Marcus's physical presence."
    }
  ];

  // Slice clues strictly matching difficulty count
  const clues = allClues.slice(0, config.clues);

  const allHints = [
    {
      level: 1,
      content: "Scrutinize the digital alibis carefully. Someone claimed to be in another wing, but their cellular signal tells a different story."
    },
    {
      level: 2,
      content: "Inspect the CCTV logs and executive bypass authorization codes. Who possessed the executive clearance to manipulate the camera loop?"
    },
    {
      level: 3,
      content: "Focus on Marcus Sterling's telephone records and physical possessions. Compare his claimed conservatory calls with the study repeater logs."
    }
  ];

  // Slice hints strictly matching difficulty count
  const hints = allHints.slice(0, config.hints);

  const evidence = [
    {
      evidenceId: "EVIDENCE_01",
      type: "CHAT",
      title: "Victim's Encrypted WhatsApp Messages",
      description: "Chat history extracted from Arthur Pendelton's secure encrypted backup.",
      timestamp: "22:08 - 22:15",
      relatedSuspects: ["SUSPECT_01"],
      content: {
        participants: ["Arthur Pendelton", "Marcus Sterling"],
        messages: [
          { sender: "Marcus Sterling", text: "Arthur, I need 5 minutes in the study. It's about the Caymans audit.", timestamp: "22:08" },
          { sender: "Arthur Pendelton", text: "Come up now. And bring the ledger. I know what you did.", timestamp: "22:10" },
          { sender: "Marcus Sterling", text: "On my way up the private elevator.", timestamp: "22:11" },
          { sender: "Arthur Pendelton", text: "What is this authorization request on my phone?!", timestamp: "22:13" },
          { sender: "Marcus Sterling", text: "Just approve it, Arthur. Don't make this difficult.", timestamp: "22:14" }
        ]
      }
    },
    {
      evidenceId: "EVIDENCE_02",
      type: "CCTV",
      title: "Study Corridor Security Camera #04",
      description: "Surveillance log and footage frames from the second floor private study corridor.",
      timestamp: "22:00 - 22:30",
      relatedSuspects: ["SUSPECT_01", "SUSPECT_02"],
      content: {
        cameraName: "CAM-04 (Study Hallway)",
        location: "Second Floor West Wing",
        recordingTime: "22:00 - 22:30",
        observations: [
          { time: "22:05", note: "Arthur Pendelton enters the private study alone." },
          { time: "22:11", note: "Feed signal glitches. System enters diagnostic loop with executive override code #MS-9941." },
          { time: "22:15", note: "Feed recovers. Figure in dark suit exits study elevator heading towards conservatory." },
          { time: "22:28", note: "Security alarm sounds. Staff rushes to study." }
        ]
      }
    },
    {
      evidenceId: "EVIDENCE_03",
      type: "DOCUMENT",
      title: "Internal IT Telecommunications Repeater Log",
      description: "System log recording wireless signal handshakes between mobile devices and estate Wi-Fi repeaters.",
      timestamp: "22:10 - 22:20",
      relatedSuspects: ["SUSPECT_01"],
      content: {
        title: "Estate Wi-Fi & Cellular Mesh Diagnostic Log",
        source: "Estate Core Router (Room 102B)",
        timestamp: "October 30, 2026 - 22:18",
        content: "DEVICE: Marcus-iPhone-15 (MAC: 4A:22:9C:F1) | 21:40 - 22:10 connected to REPEATER_CONSERVATORY. At 22:12:04 switched to REPEATER_STUDY_INTERIOR (Signal Strength: -48dBm). At 22:16:32 returned to REPEATER_CONSERVATORY."
      }
    },
    {
      evidenceId: "EVIDENCE_04",
      type: "IMAGE",
      title: "Crime Scene Photography: Study Desk",
      description: "Forensic photograph documenting the mahogany desk, overturned tumbler, and shredded wire transfer slip.",
      timestamp: "22:45",
      relatedSuspects: ["SUSPECT_01"],
      mediaUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
      content: {
        title: "Study Crime Scene Evidence Table",
        location: "Second Floor Private Study",
        findings: "Victim collapsed in executive leather chair. Fast-acting toxin detected in crystal tumbler. Monogrammed cufflink 'M.S.' wedged near baseboard."
      }
    }
  ];

  return {
    title: `The Secret of ${victimName}`,
    category: "murder",
    story: `On a stormy autumn evening at the Pendelton Estate, ${victimName}, ${victimRole}, was discovered dead in his locked second-floor study during an exclusive gathering. Forensic analysis confirmed lethal poisoning delivered mere minutes before the house alarm triggered. Each attendee harbored a hidden grievance, but only one possessed both the means, the digital access, and the fatal opportunity to strike.`,
    victim: {
      name: victimName,
      age: 54,
      occupation: victimRole,
      description: "A wealthy, demanding figure whose impending audits and contract renegotiations had put several close associates in severe peril."
    },
    suspects,
    timeline: [
      { time: "21:30", event: "Arthur enters his private study to review financial ledgers.", relatedSuspects: [] },
      { time: "22:08", event: "Marcus Sterling sends urgent encrypted messages requesting a private audience.", relatedSuspects: ["SUSPECT_01"] },
      { time: "22:11", event: "The corridor camera outside the study is overridden with an executive bypass code.", relatedSuspects: ["SUSPECT_01", "SUSPECT_02"] },
      { time: "22:14", event: "Arthur's tumbler is poisoned and an offshore wire transfer is authorized under duress.", relatedSuspects: ["SUSPECT_01"] },
      { time: "22:16", event: "The perpetrator returns to the conservatory to establish an alibi.", relatedSuspects: ["SUSPECT_01"] },
      { time: "22:28", event: "The estate alarm triggers after the victim is discovered collapsed.", relatedSuspects: [] }
    ],
    clues,
    evidence,
    hints,
    solution: {
      culpritId: culprit.suspectId,
      motive: "Marcus Sterling was facing total ruin and criminal prison sentences as Arthur's impending audit was set to expose Marcus's $2.4M offshore embezzlement scheme.",
      method: "Marcus used his executive override code (#MS-9941) to freeze the hallway CCTV camera into a 4-minute diagnostic loop. He slipped into the study, spiked Arthur's crystal tumbler with potassium cyanide, coerced him into signing the wire transfer, and retreated to the conservatory to fake an alibi.",
      explanation: "Despite his claims of being in the conservatory, the internal repeater log conclusively proved Marcus's phone connected to the study's interior repeater at 22:12. Furthermore, the CCTV loop was stamped with his exclusive executive code, and his monogrammed cufflink was discovered under the desk where Arthur resisted.",
      criticalClueIds: ["CLUE_01", "CLUE_02", "CLUE_03"],
      redHerringExplanations: [
        "Dr. Drake's dropped medical ampoule was dropped in panic while attempting cardiac resuscitation.",
        "Julian Thorne's royalty letters were bitter, but his formal arbitration had already been finalized that morning.",
        "Victor Corvo was in the wine cellar attempting petty theft of vintage Bordeaux, not committing murder."
      ]
    }
  };
};
