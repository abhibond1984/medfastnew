// services/geminiService.ts
// Removed GoogleGenAI dependency as requested for a static GitHub Pages deployment.
// Mock data is now used to simulate LLM responses.

import { DoctorSearchParams, PrescriptionAnalysisResult } from "../types";

// Mock data for doctor search results
const MOCK_DOCTOR_RESULTS = [
  {
    text: `### Top Specialists in Ranchi for Cardiology:

1.  **Dr. Balamurali Srinivasan (Medanta Hospital, Irba)**
    *   **Expertise:** Leading Cardiac Surgeon, highly experienced in complex aortic surgeries and heart transplants.
    *   **Rating & Why:** Consistently receives 5-star ratings for surgical precision and patient outcomes. Known for innovative techniques and compassionate post-operative care.
    *   **Details:** [View on Google Maps](https://www.google.com/maps/search/Medanta+Hospital+Ranchi)
    
2.  **Dr. S. K. Singh (Orchid Medical Centre, Lalpur)**
    *   **Expertise:** Renowned Cardiologist specializing in interventional cardiology, including angioplasty and stenting.
    *   **Rating & Why:** Praised for his diagnostic accuracy and patient education. Patients appreciate his clear explanations and reassuring demeanor.
    *   **Details:** [View on Google Maps](https://www.google.com/maps/search/Orchid+Medical+Centre+Ranchi)

3.  **Dr. Reema Rani (Santevita Hospital, Morabadi)**
    *   **Expertise:** A top female Cardiologist focusing on preventive cardiology and women's heart health.
    *   **Rating & Why:** Highly recommended for her holistic approach to patient care and ability to build strong patient trust.
    *   **Details:** [View on Google Maps](https://www.google.com/maps/search/Santevita+Hospital+Ranchi)
    
4.  **Dr. Alok Kumar (RIMS, Bariatu)**
    *   **Expertise:** Head of Cardiology at the state's largest hospital, with extensive experience in critical cardiac care.
    *   **Rating & Why:** Valued for his public service and expertise in managing a high volume of diverse cardiac cases.
    *   **Details:** [View on Google Maps](https://www.google.com/maps/search/RIMS+Ranchi)
`,
    chunks: [
      {
        maps: {
          uri: "https://www.google.com/maps/search/Medanta+Hospital+Ranchi",
          title: "Medanta Hospital, Irba, Ranchi",
        },
      },
      {
        maps: {
          uri: "https://www.google.com/maps/search/Orchid+Medical+Centre+Ranchi",
          title: "Orchid Medical Centre, Lalpur, Ranchi",
        },
      },
      {
        maps: {
          uri: "https://www.google.com/maps/search/Santevita+Hospital+Ranchi",
          title: "Santevita Hospital, Morabadi, Ranchi",
        },
      },
      {
        maps: {
          uri: "https://www.google.com/maps/search/RIMS+Ranchi",
          title: "RIMS (Rajendra Institute of Medical Sciences), Bariatu, Ranchi",
        },
      },
    ],
  },
  {
    text: `### Recommended Dermatologists in Ranchi:

1.  **Dr. Pooja Sharma (Dermacare Clinic, Doranda)**
    *   **Expertise:** Specializes in acne treatment, anti-aging solutions, and cosmetic dermatology.
    *   **Rating & Why:** Known for personalized care and excellent results in complex skin conditions.
    *   **Details:** [View on Google Maps](https://www.google.com/maps/search/Dermacare+Clinic+Ranchi)

2.  **Dr. Vivek Kumar (Skin & Hair Clinic, Kanke Road)**
    *   **Expertise:** Expert in hair loss treatments, psoriasis, and eczema.
    *   **Rating & Why:** Highly rated for his thorough diagnosis and effective long-term treatment plans.
    *   **Details:** [View on Google Maps](https://www.google.com/maps/search/Skin+and+Hair+Clinic+Ranchi)

3.  **Dr. Anamika Singh (Apollo Clinic, Bariatu Road)**
    *   **Expertise:** General dermatology, pediatric dermatology, and allergy testing.
    *   **Rating & Why:** Praised for her gentle approach with children and comprehensive allergy management.
    *   **Details:** [View on Google Maps](https://www.google.com/maps/search/Apollo+Clinic+Ranchi)
`,
    chunks: [
      {
        maps: {
          uri: "https://www.google.com/maps/search/Dermacare+Clinic+Ranchi",
          title: "Dermacare Clinic, Doranda, Ranchi",
        },
      },
      {
        maps: {
          uri: "https://www.google.com/maps/search/Skin+and+Hair+Clinic+Ranchi",
          title: "Skin & Hair Clinic, Kanke Road, Ranchi",
        },
      },
      {
        maps: {
          uri: "https://www.google.com/maps/search/Apollo+Clinic+Ranchi",
          title: "Apollo Clinic, Bariatu Road, Ranchi",
        },
      },
    ],
  },
  // Add more mock results for other common problems if desired
];

// Mock data for prescription analysis
const MOCK_PRESCRIPTION_RESULTS: PrescriptionAnalysisResult[] = [
  {
    medicines: [
      {
        name: "Amoxicillin 500mg",
        purpose: "Treats bacterial infections",
        contents: "Amoxicillin",
        dosageInstructions: "Take one capsule three times a day for 7 days with food.",
        warnings: "May cause nausea, diarrhea. Complete the full course even if you feel better.",
      },
      {
        name: "Paracetamol 650mg",
        purpose: "Pain relief and fever reduction",
        contents: "Paracetamol",
        dosageInstructions: "Take one tablet as needed for pain or fever, not more than 3 tablets in 24 hours.",
        warnings: "Do not exceed recommended dose. Avoid alcohol.",
      },
    ],
    summary: "This prescription is for a bacterial infection and includes medication for associated pain/fever. It's crucial to complete the antibiotic course as instructed.",
  },
  {
    medicines: [
      {
        name: "Omeprazole 20mg",
        purpose: "Reduces stomach acid",
        contents: "Omeprazole",
        dosageInstructions: "Take one capsule once daily, 30 minutes before breakfast.",
        warnings: "May cause headache, nausea. Long-term use should be monitored by a doctor.",
      },
      {
        name: "Loratadine 10mg",
        purpose: "Relieves allergy symptoms",
        contents: "Loratadine",
        dosageInstructions: "Take one tablet once daily.",
        warnings: "May cause drowsiness. Do not drive or operate machinery if affected.",
      },
    ],
    summary: "This prescription addresses acid reflux and allergy symptoms. Follow dosage carefully for optimal relief.",
  },
];

let lastDoctorResultIndex = 0;
let lastPrescriptionResultIndex = 0;

/**
 * Mocks finding doctors based on problem and location.
 */
export const findDoctors = async (
  params: DoctorSearchParams,
): Promise<{ text: string; chunks: any[] }> => {
  console.log("Mocking doctor search for:", params);
  // Simple rotation through mock results or select based on problem
  const problemLower = params.problem.toLowerCase();
  let result = MOCK_DOCTOR_RESULTS[0]; // Default to first result

  if (problemLower.includes("cardio") || problemLower.includes("heart")) {
      result = MOCK_DOCTOR_RESULTS[0];
  } else if (problemLower.includes("skin") || problemLower.includes("derma")) {
      result = MOCK_DOCTOR_RESULTS[1];
  } else {
    // If no specific match, cycle through all for variety
    lastDoctorResultIndex = (lastDoctorResultIndex + 1) % MOCK_DOCTOR_RESULTS.length;
    result = MOCK_DOCTOR_RESULTS[lastDoctorResultIndex];
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return result;
};

/**
 * Mocks analyzing a prescription image.
 */
export const analyzePrescription = async (
  imageBase64: string, // Keep signature consistent, but actual image data is ignored
): Promise<PrescriptionAnalysisResult> => {
  console.log("Mocking prescription analysis (image data ignored):", imageBase64 ? "Image present" : "No image");
  
  // Cycle through mock results for variety
  lastPrescriptionResultIndex = (lastPrescriptionResultIndex + 1) % MOCK_PRESCRIPTION_RESULTS.length;
  const result = MOCK_PRESCRIPTION_RESULTS[lastPrescriptionResultIndex];

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return result;
};