import { LanguageCode } from './languages';

export interface TranslationDictionary {
  // Brand & General
  appName: string;
  tagline: string;
  heroSub: string;
  personalCopilot: string;
  language: string;

  // Navigation
  navHome: string;
  navJourney: string;
  navRecords: string;
  navCopilot: string;
  navLabs: string;
  navMedications: string;
  navAppointments: string;
  navDoctors: string;
  navDoctorVisit: string;
  navEmergency: string;
  navPrivacy: string;
  navProfile: string;
  navSettings: string;

  // Portals
  switchPortal: string;
  doctorPortal: string;
  hospitalPortal: string;
  patientPortal: string;
  mlRegistry: string;
  signOut: string;

  // Actions
  scheduleVisit: string;
  confirmAppointment: string;
  cancel: string;
  cancelVisit: string;
  confirm: string;
  save: string;
  uploadDocument: string;
  delete: string;
  viewDetails: string;
  search: string;
  filter: string;
  close: string;
  getStarted: string;
  exploreHealthx: string;
  loading: string;

  // Appointments
  apptsTitle: string;
  apptsSubtitle: string;
  scheduleApptTitle: string;
  doctorName: string;
  hospitalClinic: string;
  dateTime: string;
  reasonForVisit: string;
  scheduledTime: string;
  noVisitsTitle: string;
  noVisitsDesc: string;
  apptSuccessMsg: string;
  confirmedSlot: string;

  // Assistant
  assistantTitle: string;
  assistantSubtitle: string;
  askPlaceholder: string;
  sendBtn: string;
  aiDisclaimer: string;
  suggestedQuestions: string;

  // Labs
  labsTitle: string;
  labsSubtitle: string;
  statusNormal: string;
  statusLow: string;
  statusHigh: string;
  statusCritical: string;

  // Medications
  medsTitle: string;
  medsSubtitle: string;
  addMedication: string;

  // Emergency
  emergencyTitle: string;
  emergencySubtitle: string;
  bloodGroup: string;
  allergies: string;
  emergencyContact: string;

  // Landing features
  featureRecordIntelligence: string;
  featureCopilot: string;
  featureJourney: string;
  featureLabs: string;
  featureDoctorVisit: string;
  featureConsent: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  // ==========================================
  // ENGLISH
  // ==========================================
  en: {
    appName: 'HEALTHX AI',
    tagline: 'Your Health. Connected. Understood.',
    heroSub: 'Turn fragmented medical records into one intelligent, searchable and understandable health journey.',
    personalCopilot: 'PERSONAL HEALTH COPILOT',
    language: 'Language',

    navHome: 'Home',
    navJourney: 'Health Journey',
    navRecords: 'Medical Records',
    navCopilot: 'AI Copilot',
    navLabs: 'Lab Results',
    navMedications: 'Medications',
    navAppointments: 'Appointments',
    navDoctors: 'Doctors & Hospitals',
    navDoctorVisit: 'Doctor Visit Mode',
    navEmergency: 'Emergency',
    navPrivacy: 'Privacy & Consent',
    navProfile: 'Profile',
    navSettings: 'Settings',

    switchPortal: 'Switch Portal',
    doctorPortal: 'Doctor Portal',
    hospitalPortal: 'Hospital Portal',
    patientPortal: 'Patient Portal',
    mlRegistry: 'ML Registry',
    signOut: 'Sign Out',

    scheduleVisit: 'Schedule Visit',
    confirmAppointment: 'Confirm Appointment',
    cancel: 'Cancel',
    cancelVisit: 'Cancel Visit',
    confirm: 'Confirm',
    save: 'Save',
    uploadDocument: 'Upload Document',
    delete: 'Delete',
    viewDetails: 'View Details',
    search: 'Search',
    filter: 'Filter',
    close: 'Close',
    getStarted: 'Get Started',
    exploreHealthx: 'Explore HealthX',
    loading: 'Loading...',

    apptsTitle: 'Clinical Appointments & Consultations',
    apptsSubtitle: 'Manage upcoming hospital visits, follow-up dates, and consultation notes',
    scheduleApptTitle: 'Schedule Medical Appointment',
    doctorName: 'Doctor Name',
    hospitalClinic: 'Hospital / Clinic',
    dateTime: 'Date & Time',
    reasonForVisit: 'Reason for Visit',
    scheduledTime: 'Scheduled Time',
    noVisitsTitle: 'No scheduled visits yet',
    noVisitsDesc: 'Schedule a follow-up consultation or hospital visit using the button above.',
    apptSuccessMsg: 'Appointment successfully scheduled with',
    confirmedSlot: 'Confirmed Slot',

    assistantTitle: 'AI Health Copilot',
    assistantSubtitle: 'Ask questions regarding your lab results, medication history, and medical records.',
    askPlaceholder: 'Ask about your hemoglobin, blood sugar, medications, or doctor visit prep...',
    sendBtn: 'Send',
    aiDisclaimer: 'HealthX AI is an intelligent health assistant and not an autonomous medical decision maker. Always consult a licensed doctor.',
    suggestedQuestions: 'Suggested Questions',

    labsTitle: 'Lab Intelligence & Biomarkers',
    labsSubtitle: 'Track blood counts, metabolic markers, and organ function panels over time',
    statusNormal: 'Normal',
    statusLow: 'Low',
    statusHigh: 'High',
    statusCritical: 'Critical',

    medsTitle: 'Medications & Prescriptions',
    medsSubtitle: 'Active prescriptions, dosages, and administration schedules',
    addMedication: 'Add Medication',

    emergencyTitle: 'Emergency Medical Profile',
    emergencySubtitle: 'Instant one-tap medical identity card for first responders and ER clinicians',
    bloodGroup: 'Blood Group',
    allergies: 'Allergies',
    emergencyContact: 'Emergency Contact',

    featureRecordIntelligence: 'Medical Record Intelligence',
    featureCopilot: 'AI Health Copilot',
    featureJourney: 'Unified Health Journey',
    featureLabs: 'Lab Intelligence',
    featureDoctorVisit: 'Doctor Visit Mode',
    featureConsent: 'Consent-Based Sharing',
  },

  // ==========================================
  // HINDI (हिन्दी)
  // ==========================================
  hi: {
    appName: 'हेल्थएक्स एआई',
    tagline: 'आपका स्वास्थ्य। जुड़ा हुआ। समझा हुआ।',
    heroSub: 'बिखरे हुए मेडिकल रिकॉर्ड्स को एक बुद्धिमान, खोजने योग्य और समझने योग्य स्वास्थ्य यात्रा में बदलें।',
    personalCopilot: 'पर्सनल हेल्थ कोपायलट',
    language: 'भाषा',

    navHome: 'होम',
    navJourney: 'स्वास्थ्य यात्रा',
    navRecords: 'मेडिकल रिकॉर्ड्स',
    navCopilot: 'एआई कोपायलट',
    navLabs: 'लैब परिणाम',
    navMedications: 'दवाइयां',
    navAppointments: 'अपॉइंटमेंट्स',
    navDoctors: 'डॉक्टर और अस्पताल',
    navDoctorVisit: 'डॉक्टर विजिट मोड',
    navEmergency: 'आपातकालीन',
    navPrivacy: 'गोपनीयता और सहमति',
    navProfile: 'प्रोफ़ाइल',
    navSettings: 'सेटिंग्स',

    switchPortal: 'पोर्टल बदलें',
    doctorPortal: 'डॉक्टर पोर्टल',
    hospitalPortal: 'अस्पताल पोर्टल',
    patientPortal: 'मरीज़ पोर्टल',
    mlRegistry: 'एमएल रजिस्ट्री',
    signOut: 'लॉग आउट',

    scheduleVisit: 'अपॉइंटमेंट तय करें',
    confirmAppointment: 'अपॉइंटमेंट की पुष्टि करें',
    cancel: 'रद्द करें',
    cancelVisit: 'विजिट रद्द करें',
    confirm: 'पुष्टि करें',
    save: 'सहेजें',
    uploadDocument: 'दस्तावेज़ अपलोड करें',
    delete: 'हटाएं',
    viewDetails: 'विवरण देखें',
    search: 'खोजें',
    filter: 'फ़िल्टर',
    close: 'बंद करें',
    getStarted: 'शुरू करें',
    exploreHealthx: 'हेल्थएक्स देखें',
    loading: 'लोड हो रहा है...',

    apptsTitle: 'क्लिनिकल अपॉइंटमेंट्स और परामर्श',
    apptsSubtitle: 'आगामी अस्पताल यात्राएं, फॉलो-अप तारीखें और परामर्श नोट्स प्रबंधित करें',
    scheduleApptTitle: 'मेडिकल अपॉइंटमेंट शेड्यूल करें',
    doctorName: 'डॉक्टर का नाम',
    hospitalClinic: 'अस्पताल / क्लिनिक',
    dateTime: 'तारीख और समय',
    reasonForVisit: 'यात्रा का कारण',
    scheduledTime: 'निर्धारित समय',
    noVisitsTitle: 'कोई निर्धारित विजिट नहीं है',
    noVisitsDesc: 'ऊपर दिए गए बटन का उपयोग करके फॉलो-अप परामर्श तय करें।',
    apptSuccessMsg: 'अपॉइंटमेंट सफलतापूर्वक तय हुआ:',
    confirmedSlot: 'पुष्ट स्लॉट',

    assistantTitle: 'एआई हेल्थ कोपायलट',
    assistantSubtitle: 'अपने लैब परिणामों, दवाओं और मेडिकल रिकॉर्ड्स के बारे में प्रश्न पूछें।',
    askPlaceholder: 'अपने हीमोग्लोबिन, ब्लड शुगर, दवाओं या डॉक्टर विजिट के बारे में पूछें...',
    sendBtn: 'भेजें',
    aiDisclaimer: 'हेल्थएक्स एआई एक बुद्धिमान सहायक है और स्वायत्त डॉक्टर नहीं है। हमेशा योग्य चिकित्सक से परामर्श लें।',
    suggestedQuestions: 'सुझाए गए प्रश्न',

    labsTitle: 'लैब इंटेलिजेंस और बायोमार्कर्स',
    labsSubtitle: 'समय के साथ रक्त गणना, मेटाबोलिक मार्कर और अंग कार्य की निगरानी करें',
    statusNormal: 'सामान्य',
    statusLow: 'कम',
    statusHigh: 'अधिक',
    statusCritical: 'गंभीर',

    medsTitle: 'दवाइयां और नुस्खे',
    medsSubtitle: 'सक्रिय दवाएं, खुराक और सेवन का समय',
    addMedication: 'दवा जोड़ें',

    emergencyTitle: 'आपातकालीन मेडिकल प्रोफ़ाइल',
    emergencySubtitle: 'आपातकालीन कर्मियों और डॉक्टरों के लिए त्वरित मेडिकल पहचान पत्र',
    bloodGroup: 'रक्त समूह',
    allergies: 'एलर्जी',
    emergencyContact: 'आपातकालीन संपर्क',

    featureRecordIntelligence: 'मेडिकल रिकॉर्ड इंटेलिजेंस',
    featureCopilot: 'एआई हेल्थ कोपायलट',
    featureJourney: 'एकीकृत स्वास्थ्य यात्रा',
    featureLabs: 'लैब इंटेलिजेंस',
    featureDoctorVisit: 'डॉक्टर विजिट मोड',
    featureConsent: 'सहमति-आधारित साझाकरण',
  },

  // ==========================================
  // GUJARATI (ગુજરાતી)
  // ==========================================
  gu: {
    appName: 'હેલ્થએક્સ એઆઈ',
    tagline: 'તમારું આરોગ્ય. જોડાયેલું. સમજાયેલું.',
    heroSub: 'તમારા મેડિકલ રેકોર્ડ્સને એક બુદ્ધિશાળી, શોધવા યોગ્ય અને સમજાય તેવી સ્વાસ્થ્ય યાત્રામાં રૂપાંતરિત કરો.',
    personalCopilot: 'પર્સનલ હેલ્થ કોપાયલટ',
    language: 'ભાષા',

    navHome: 'હોમ',
    navJourney: 'સ્વાસ્થ્ય યાત્રા',
    navRecords: 'મેડિકલ રેકોર્ડ્સ',
    navCopilot: 'એઆઈ કોપાયલટ',
    navLabs: 'લેબ પરિણામો',
    navMedications: 'દવાઓ',
    navAppointments: 'મુલાકાતો (એપોઇન્ટમેન્ટ્સ)',
    navDoctors: 'ડૉક્ટરો અને હોસ્પિટલો',
    navDoctorVisit: 'ડૉક્ટર મુલાકાત મોડ',
    navEmergency: 'ઇમરજન્સી',
    navPrivacy: 'ગોપનીયતા અને સંમતિ',
    navProfile: 'પ્રોફાઇલ',
    navSettings: 'સેટિંગ્સ',

    switchPortal: 'પોર્ટલ બદલો',
    doctorPortal: 'ડૉક્ટર પોર્ટલ',
    hospitalPortal: 'હોસ્પિટલ પોર્ટલ',
    patientPortal: 'દર્દી પોર્ટલ',
    mlRegistry: 'એમએલ રજિસ્ટ્રી',
    signOut: 'સાઇન આઉટ',

    scheduleVisit: 'મુલાકાત નક્કી કરો',
    confirmAppointment: 'મુલાકાત કન્ફર્મ કરો',
    cancel: 'રદ કરો',
    cancelVisit: 'મુલાકાત રદ કરો',
    confirm: 'ખાતરી કરો',
    save: 'સાચવો',
    uploadDocument: 'દસ્તાવેજ અપલોડ કરો',
    delete: 'કાઢી નાખો',
    viewDetails: 'વિગતો જુઓ',
    search: 'શોધો',
    filter: 'ફિલ્ટર',
    close: 'બંધ કરો',
    getStarted: 'શરૂ કરો',
    exploreHealthx: 'હેલ્થએક્સ જુઓ',
    loading: 'લોડ થઈ રહ્યું છે...',

    apptsTitle: 'ક્લિનિકલ એપોઇન્ટમેન્ટ્સ અને પરામર્શ',
    apptsSubtitle: 'આગામી હોસ્પિટલ મુલાકાતો, ફોલો-અપ તારીખો અને નોંધો મેનેજ કરો',
    scheduleApptTitle: 'મેડિકલ એપોઇન્ટમેન્ટ બુક કરો',
    doctorName: 'ડૉક્ટરનું નામ',
    hospitalClinic: 'હોસ્પિટલ / ક્લિનિક',
    dateTime: 'તારીખ અને સમય',
    reasonForVisit: 'મુલાકાતનું કારણ',
    scheduledTime: 'નક્કી કરેલ સમય',
    noVisitsTitle: 'કોઈ નક્કી કરેલી મુલાકાતો નથી',
    noVisitsDesc: 'ઉપરના બટનનો ઉપયોગ કરીને મુલાકાત બુક કરો.',
    apptSuccessMsg: 'એપોઇન્ટમેન્ટ સફળતાપૂર્વક બુક થઈ ગઈ:',
    confirmedSlot: 'કન્ફર્મ સ્લોટ',

    assistantTitle: 'એઆઈ હેલ્થ કોપાયલટ',
    assistantSubtitle: 'તમારા લેબ પરિણામો, દવાઓ અને મેડિકલ રેકોર્ડ્સ વિશે પ્રશ્નો પૂછો.',
    askPlaceholder: 'તમારા હિમોગ્લોબિન, બ્લડ સુગર, દવાઓ અથવા ડૉક્ટર મુલાકાત વિશે પૂછો...',
    sendBtn: 'મોકલો',
    aiDisclaimer: 'હેલ્થએક્સ એઆઈ એક સહાયક છે, સ્વતંત્ર ડૉક્ટર નથી. હંમેશા તબીબની સલાહ લો.',
    suggestedQuestions: 'સૂચવેલા પ્રશ્નો',

    labsTitle: 'લેબ ઇન્ટેલિજન્સ અને બાયોમાર્કર્સ',
    labsSubtitle: 'સમય જતાં રક્ત ગણતરી અને અંગોની કાર્યક્ષમતા ટ્રૅક કરો',
    statusNormal: 'સામાન્ય',
    statusLow: 'ઓછું',
    statusHigh: 'વધુ',
    statusCritical: 'ગંભીર',

    medsTitle: 'દવાઓ અને પ્રિસ્ક્રિપ્શન્સ',
    medsSubtitle: 'ચાલુ દવાઓ, ડોઝ અને સમયપત્રક',
    addMedication: 'દવા ઉમેરો',

    emergencyTitle: 'ઇમરજન્સી મેડિકલ પ્રોફાઇલ',
    emergencySubtitle: 'ઇમરજન્સી ટીમ અને ડૉક્ટરો માટે ત્વરિત ઓળખપત્ર',
    bloodGroup: 'બ્લડ ગ્રુપ',
    allergies: 'એલર્જી',
    emergencyContact: 'ઇમરજન્સી સંપર્ક',

    featureRecordIntelligence: 'મેડિકલ રેકોર્ડ ઇન્ટેલિજન્સ',
    featureCopilot: 'એઆઈ હેલ્થ કોપાયલટ',
    featureJourney: 'સંકલિત સ્વાસ્થ્ય યાત્રા',
    featureLabs: 'લેબ ઇન્ટેલિજન્સ',
    featureDoctorVisit: 'ડૉક્ટર મુલાકાત મોડ',
    featureConsent: 'સંમતિ-આધારિત શેરિંગ',
  },

  // ==========================================
  // TAMIL (தமிழ்)
  // ==========================================
  ta: {
    appName: 'ஹெல்த்எக்ஸ் ஏஐ',
    tagline: 'உங்கள் நலம். இணைக்கப்பட்டது. புரிந்துகொள்ளப்பட்டது.',
    heroSub: 'சிதறிய மருத்துவ ஆவணங்களை அறிவார்ந்த, தேடக்கூடிய மற்றும் புரிந்துகொள்ளக்கூடிய சுகாதார பயணமாக மாற்றவும்.',
    personalCopilot: 'தனிப்பட்ட சுகாதார வழிகாட்டி',
    language: 'மொழி',

    navHome: 'முகப்பு',
    navJourney: 'சுகாதார பயணம்',
    navRecords: 'மருத்துவ பதிவுகள்',
    navCopilot: 'ஏஐ உதவியாளர்',
    navLabs: 'ஆய்வக முடிவுகள்',
    navMedications: 'மருந்துகள்',
    navAppointments: 'சந்திப்புகள்',
    navDoctors: 'மருத்துவர்கள் & மருத்துவமனைகள்',
    navDoctorVisit: 'மருத்துவர் சந்திப்பு முறை',
    navEmergency: 'அவசர நிலை',
    navPrivacy: 'தனியுரிமை & ஒப்புதல்',
    navProfile: 'சுயவிவரம்',
    navSettings: 'அமைப்புகள்',

    switchPortal: 'தளத்தை மாற்றவும்',
    doctorPortal: 'மருத்துவர் தளம்',
    hospitalPortal: 'மருத்துவமனை தளம்',
    patientPortal: 'நோயாளி தளம்',
    mlRegistry: 'எம்எல் பதிவேடு',
    signOut: 'வெளியேறு',

    scheduleVisit: 'சந்திப்பை பதிவு செய்',
    confirmAppointment: 'சந்திப்பை உறுதிசெய்',
    cancel: 'ரத்து செய்',
    cancelVisit: 'சந்திப்பை ரத்து செய்',
    confirm: 'உறுதிப்படுத்து',
    save: 'சேமி',
    uploadDocument: 'ஆவணத்தைப் பதிவேற்றவும்',
    delete: 'நீக்கு',
    viewDetails: 'விவரங்களைப் பார்க்கவும்',
    search: 'தேடு',
    filter: 'வடிகட்டு',
    close: 'மூடு',
    getStarted: 'தொடங்குங்கள்',
    exploreHealthx: 'ஆராயுங்கள்',
    loading: 'ஏற்றுகிறது...',

    apptsTitle: 'மருத்துவ சந்திப்புகள் & ஆலோசனைகள்',
    apptsSubtitle: 'மருத்துவமனை வருகைகள் மற்றும் ஆலோசனை குறிப்புகளை நிர்வகிக்கவும்',
    scheduleApptTitle: 'மருத்துவ சந்திப்பை திட்டமிடுங்கள்',
    doctorName: 'மருத்துவர் பெயர்',
    hospitalClinic: 'மருத்துவமனை / கிளினிக்',
    dateTime: 'தேதி & நேரம்',
    reasonForVisit: 'வருகைக்கான காரணம்',
    scheduledTime: 'திட்டமிடப்பட்ட நேரம்',
    noVisitsTitle: 'திட்டமிடப்பட்ட சந்திப்புகள் இல்லை',
    noVisitsDesc: 'மேலே உள்ள பொத்தானைப் பயன்படுத்தி சந்திப்பைத் திட்டமிடுங்கள்.',
    apptSuccessMsg: 'சந்திப்பு வெற்றிகரமாக திட்டமிடப்பட்டது:',
    confirmedSlot: 'உறுதிப்படுத்தப்பட்ட நேரம்',

    assistantTitle: 'ஏஐ சுகாதார உதவியாளர்',
    assistantSubtitle: 'ஆய்வக முடிவுகள் மற்றும் மருந்துகள் குறித்து கேள்விகளைக் கேளுங்கள்.',
    askPlaceholder: 'ஹீமோகுளோபின், சர்க்கரை அளவு அல்லது மருந்துகள் பற்றி கேட்கவும்...',
    sendBtn: 'அனுப்பு',
    aiDisclaimer: 'ஹெல்த்எக்ஸ் ஏஐ ஒரு தகவல் வழிகாட்டி மட்டுமே. மருத்துவ முடிவுகளுக்கு மருத்துவரை அணுகவும்.',
    suggestedQuestions: 'பரிந்துரைக்கப்பட்ட கேள்விகள்',

    labsTitle: 'ஆய்வக நுண்ணறிவு & அளவீடுகள்',
    labsSubtitle: 'இரத்த அணுக்கள் மற்றும் உறுப்பு செயல்பாடுகளை கண்காணிக்கவும்',
    statusNormal: 'இயல்பானது',
    statusLow: 'குறைவு',
    statusHigh: 'அதிகம்',
    statusCritical: 'ஆபத்தானது',

    medsTitle: 'மருந்துகள் & பரிந்துரைகள்',
    medsSubtitle: 'தற்போதைய மருந்துகள் மற்றும் அளவு அட்டவணை',
    addMedication: 'மருந்து சேர்க்கவும்',

    emergencyTitle: 'அவசர மருத்துவ விவரம்',
    emergencySubtitle: 'அவசர சிகிச்சைப் பணியாளர்களுக்கான உடனடி அடையாள அட்டை',
    bloodGroup: 'இரத்த வகை',
    allergies: 'ஒவ்வாமைகள்',
    emergencyContact: 'அவசர தொடர்பு',

    featureRecordIntelligence: 'மருத்துவ ஆவண நுண்ணறிவு',
    featureCopilot: 'ஏஐ சுகாதார வழிகாட்டி',
    featureJourney: 'ஒருங்கிணைந்த சுகாதார பயணம்',
    featureLabs: 'ஆய்வக நுண்ணறிவு',
    featureDoctorVisit: 'மருத்துவர் சந்திப்பு முறை',
    featureConsent: 'ஒப்புதல் அடிப்படையிலான பகிர்வு',
  },

  // ==========================================
  // TELUGU (తెలుగు)
  // ==========================================
  te: {
    appName: 'హెల్త్‌ఎక్స్ ఏఐ',
    tagline: 'మీ ఆరోగ్యం. అనుసంధానించబడింది. అర్థం చేసుకోబడింది.',
    heroSub: 'విచ్ఛిన్నమైన వైద్య రికార్డులను శోధించదగిన మరియు అర్థమయ్యే ఆరోగ్య ప్రయాణంగా మార్చండి.',
    personalCopilot: 'వ్యక్తిగత ఆరోగ్య సహచరుడు',
    language: 'భాష',

    navHome: 'హోమ్',
    navJourney: 'ఆరోగ్య ప్రయాణం',
    navRecords: 'వైద్య రికార్డులు',
    navCopilot: 'ఏఐ అసిస్టెంట్',
    navLabs: 'ల్యాబ్ ఫలితాలు',
    navMedications: 'మందులు',
    navAppointments: 'అపాయింట్‌మెంట్లు',
    navDoctors: 'వైద్యులు & ఆసుపత్రులు',
    navDoctorVisit: 'డాక్టర్ సందర్శన మోడ్',
    navEmergency: 'అత్యవసర పరిస్థితి',
    navPrivacy: 'గోప్యత & సమ్మతి',
    navProfile: 'ప్రొఫైల్',
    navSettings: 'సెట్టింగ్‌లు',

    switchPortal: 'పోర్టల్ మార్చండి',
    doctorPortal: 'డాక్టర్ పోర్టల్',
    hospitalPortal: 'హాస్పిటల్ పోర్టల్',
    patientPortal: 'రోగి పోర్టల్',
    mlRegistry: 'ఎంఎల్ రిజిస్ట్రీ',
    signOut: 'లాగ్ అవుట్',

    scheduleVisit: 'అపాయింట్‌మెంట్ బుక్ చేయండి',
    confirmAppointment: 'అపాయింట్‌మెంట్ నిర్ధారించండి',
    cancel: 'రద్దు చేయి',
    cancelVisit: 'సందర్శన రద్దు చేయి',
    confirm: 'నిర్ధారించండి',
    save: 'సేవ్ చేయి',
    uploadDocument: 'పత్రాన్ని అప్‌లోడ్ చేయండి',
    delete: 'తొలగించు',
    viewDetails: 'వివరాలు చూడండి',
    search: 'వెతకండి',
    filter: 'ఫిల్టర్',
    close: 'మూసివేయి',
    getStarted: 'ప్రారంభించండి',
    exploreHealthx: 'అన్వేషించండి',
    loading: 'లోడ్ అవుతోంది...',

    apptsTitle: 'వైద్య అపాయింట్‌మెంట్లు & సంప్రదింపులు',
    apptsSubtitle: 'రాబోయే ఆసుపత్రి సందర్శనలు మరియు సంప్రదింపు నోట్లను నిర్వహించండి',
    scheduleApptTitle: 'వైద్య అపాయింట్‌మెంట్ షెడ్యూల్ చేయండి',
    doctorName: 'డాక్టర్ పేరు',
    hospitalClinic: 'ఆసుపత్రి / క్లినిక్',
    dateTime: 'తేదీ & సమయం',
    reasonForVisit: 'సందర్శన కారణం',
    scheduledTime: 'షెడ్యూల్ చేసిన సమయం',
    noVisitsTitle: 'షెడ్యూల్ చేసిన సందర్శనలు లేవు',
    noVisitsDesc: 'పై బటన్ ఉపయోగించి అపాయింట్‌మెంట్ బుక్ చేసుకోండి.',
    apptSuccessMsg: 'అపాయింట్‌మెంట్ విజయవంతంగా షెడ్యూల్ చేయబడింది:',
    confirmedSlot: 'ధృవీకరించబడిన స్లాట్',

    assistantTitle: 'ఏఐ హెల్త్ కోపైలట్',
    assistantSubtitle: 'మీ ల్యాబ్ ఫలితాలు మరియు మందుల గురించి ప్రశ్నలు అడగండి.',
    askPlaceholder: 'హిమోగ్లోబిన్, బ్లడ్ షుగర్ లేదా మందుల గురించి అడగండి...',
    sendBtn: 'పంపు',
    aiDisclaimer: 'హెల్త్‌ఎక్స్ ఏఐ కేవలం సమాచార సహాయకుడు మాత్రమే. ఎల్లప్పుడూ వైద్యుడిని సంప్రదించండి.',
    suggestedQuestions: 'సూచించిన ప్రశ్నలు',

    labsTitle: 'ల్యాబ్ ఇంటెలిజెన్స్ & బయోమార్కర్లు',
    labsSubtitle: 'రక్త కణాలు మరియు అవయవ పనితీరును ట్రాక్ చేయండి',
    statusNormal: 'సాధారణం',
    statusLow: 'తక్కువ',
    statusHigh: 'ఎక్కువ',
    statusCritical: 'ప్రమాదకరం',

    medsTitle: 'మందులు & ప్రిస్క్రిప్షన్లు',
    medsSubtitle: 'ప్రస్తుత మందులు మరియు మోతాదు వివరాలు',
    addMedication: 'మందును జోడించండి',

    emergencyTitle: 'అత్యవసర వైద్య ప్రొఫైల్',
    emergencySubtitle: 'అత్యవసర బృందాల కోసం తక్షణ గుర్తింపు కార్డు',
    bloodGroup: 'రక్త గ్రూపు',
    allergies: 'అలెర్జీలు',
    emergencyContact: 'అత్యవసర సంప్రదింపు',

    featureRecordIntelligence: 'వైద్య రికార్డుల మేధస్సు',
    featureCopilot: 'ఏఐ హెల్త్ కోపైలట్',
    featureJourney: 'సమగ్ర ఆరోగ్య ప్రయాణం',
    featureLabs: 'ల్యాబ్ ఇంటెలిజెన్స్',
    featureDoctorVisit: 'డాక్టర్ సందర్శన మోడ్',
    featureConsent: 'సమ్మతి ఆధారిత భాగస్వామ్యం',
  },

  // ==========================================
  // MARATHI (मराठी)
  // ==========================================
  mr: {
    appName: 'हेल्थएक्स एआय',
    tagline: 'तुमचे आरोग्य. जोडलेले. समजलेले.',
    heroSub: 'अव्यवस्थित वैद्यकीय नोंदींना एका बुद्धिमान, शोधण्यायोग्य आरोग्य प्रवासात रूपांतरित करा.',
    personalCopilot: 'पर्सनल हेल्थ कोपायलट',
    language: 'भाषा',

    navHome: 'होम',
    navJourney: 'आरोग्य प्रवास',
    navRecords: 'वैद्यकीय नोंदी',
    navCopilot: 'एआय कोपायलट',
    navLabs: 'लॅब निकाल',
    navMedications: 'औषधे',
    navAppointments: 'अपॉइंटमेंट्स',
    navDoctors: 'डॉक्टर आणि रुग्णालये',
    navDoctorVisit: 'डॉक्टर भेट मोड',
    navEmergency: 'आपत्कालीन',
    navPrivacy: 'गोपनीयता आणि संमती',
    navProfile: 'प्रोफाइल',
    navSettings: 'सेटिंग्ज',

    switchPortal: 'पोर्टल बदला',
    doctorPortal: 'डॉक्टर पोर्टल',
    hospitalPortal: 'रुग्णालय पोर्टल',
    patientPortal: 'रुग्ण पोर्टल',
    mlRegistry: 'एमएल नोंदणी',
    signOut: 'साइन आउट',

    scheduleVisit: 'भेट ठरवा',
    confirmAppointment: 'अपॉइंटमेंट निश्चित करा',
    cancel: 'रद्द करा',
    cancelVisit: 'भेट रद्द करा',
    confirm: 'निश्चित करा',
    save: 'जतन करा',
    uploadDocument: 'कागदपत्र अपलोड करा',
    delete: 'हटवा',
    viewDetails: 'तपशील पहा',
    search: 'शोधा',
    filter: 'फिल्टर',
    close: 'बंद करा',
    getStarted: 'सुरू करा',
    exploreHealthx: 'हेल्थएक्स एक्सप्लोर करा',
    loading: 'लोड होत आहे...',

    apptsTitle: 'क्लिनिकल अपॉइंटमेंट्स आणि सल्लामसलत',
    apptsSubtitle: 'आगामी रुग्णालय भेटी आणि फॉलो-अप तारखा व्यवस्थापित करा',
    scheduleApptTitle: 'वैद्यकीय भेट निश्चित करा',
    doctorName: 'डॉक्टरांचे नाव',
    hospitalClinic: 'रुग्णालय / क्लिनिक',
    dateTime: 'तारीख आणि वेळ',
    reasonForVisit: 'भेटीचे कारण',
    scheduledTime: 'निश्चित वेळ',
    noVisitsTitle: 'कोणत्याही भेटी ठरलेल्या नाहीत',
    noVisitsDesc: 'वरील बटण वापरून नवीन भेट निश्चित करा.',
    apptSuccessMsg: 'अपॉइंटमेंट यशस्वीरीत्या निश्चित झाली:',
    confirmedSlot: 'पुष्टी झालेला स्लॉट',

    assistantTitle: 'एआय हेल्थ कोपायलट',
    assistantSubtitle: 'तुमच्या लॅब निकालांबद्दल आणि औषधांबद्दल प्रश्न विचारा.',
    askPlaceholder: 'हिमोग्लोबिन, साखर, औषधे किंवा डॉक्टर भेटीबद्दल विचारा...',
    sendBtn: 'पाठवा',
    aiDisclaimer: 'हेल्थएक्स एआय केवळ माहितीसाठी आहे. वैद्यकीय सल्ल्यासाठी डॉक्टरांशी संपर्क साधा.',
    suggestedQuestions: 'सुचवलेले प्रश्न',

    labsTitle: 'लॅब इंटेलिजन्स आणि बायोमार्कर्स',
    labsSubtitle: 'रक्त पेशी आणि अवयवांच्या कार्याचा मागोवा घ्या',
    statusNormal: 'सामान्य',
    statusLow: 'कमी',
    statusHigh: 'जास्त',
    statusCritical: 'गंभीर',

    medsTitle: 'औषधे आणि प्रिस्क्रिप्शन',
    medsSubtitle: 'सध्याची औषधे, डोस आणि वेळ',
    addMedication: 'औषध जोडा',

    emergencyTitle: 'आपत्कालीन वैद्यकीय प्रोफाइल',
    emergencySubtitle: 'आपत्कालीन वैद्यकीय कर्मचाऱ्यांसाठी त्वरित ओळखपत्र',
    bloodGroup: 'रक्तगट',
    allergies: 'ऍलर्जी',
    emergencyContact: 'आपत्कालीन संपर्क',

    featureRecordIntelligence: 'वैद्यकीय रेकॉर्ड बुद्धिमत्ता',
    featureCopilot: 'एआय हेल्थ कोपायलट',
    featureJourney: 'एकात्मिक आरोग्य प्रवास',
    featureLabs: 'लॅब इंटेलिजन्स',
    featureDoctorVisit: 'डॉक्टर भेट मोड',
    featureConsent: 'संमती-आधारित शेअरिंग',
  },

  // ==========================================
  // BENGALI (বাংলা)
  // ==========================================
  bn: {
    appName: 'হেলথএক্স এআই',
    tagline: 'আপনার স্বাস্থ্য। সংযুক্ত। বোধগম্য।',
    heroSub: 'বিক্ষিপ্ত মেডিকেল রেকর্ডগুলিকে একটি বুদ্ধিমান এবং বোধগম্য স্বাস্থ্য যাত্রায় রূপান্তর করুন।',
    personalCopilot: 'ব্যক্তিগত স্বাস্থ্য সহকারী',
    language: 'ভাষা',

    navHome: 'হোম',
    navJourney: 'স্বাস্থ্য যাত্রা',
    navRecords: 'মেডিকেল রেকর্ড',
    navCopilot: 'এআই সহকারী',
    navLabs: 'ল্যাব রিপোর্ট',
    navMedications: 'ওষুধ',
    navAppointments: 'অ্যাপয়েন্টমেন্ট',
    navDoctors: 'ডাক্তার ও হাসপাতাল',
    navDoctorVisit: 'ডাক্তার পরিদর্শন মোড',
    navEmergency: 'জরুরী অবস্থা',
    navPrivacy: 'গোপনীয়তা ও সম্মতি',
    navProfile: 'প্রোফাইল',
    navSettings: 'সেটিংস',

    switchPortal: 'পোর্টাল পরিবর্তন',
    doctorPortal: 'ডাক্তার পোর্টাল',
    hospitalPortal: 'হাসপাতাল পোর্টাল',
    patientPortal: 'রোগী পোর্টাল',
    mlRegistry: 'এমএল রেজিস্ট্রি',
    signOut: 'লগ আউট',

    scheduleVisit: 'অ্যাপয়েন্টমেন্ট নিন',
    confirmAppointment: 'অ্যাপয়েন্টমেন্ট নিশ্চিত করুন',
    cancel: 'বাতিল',
    cancelVisit: 'সাক্ষাৎ বাতিল করুন',
    confirm: 'নিশ্চিত করুন',
    save: 'সংরক্ষণ করুন',
    uploadDocument: 'নথি আপলোড করুন',
    delete: 'মুছুন',
    viewDetails: 'বিস্তারিত দেখুন',
    search: 'অনুসন্ধান',
    filter: 'ফিল্টার',
    close: 'বন্ধ করুন',
    getStarted: 'শুরু করুন',
    exploreHealthx: 'অন্বেষণ করুন',
    loading: 'লোড হচ্ছে...',

    apptsTitle: 'ক্লিনিক্যাল অ্যাপয়েন্টমেন্ট ও পরামর্শ',
    apptsSubtitle: 'আসন্ন হাসপাতাল পরিদর্শন এবং পরামর্শ নোট পরিচালনা করুন',
    scheduleApptTitle: 'মেডিকেল অ্যাপয়েন্টমেন্ট নির্ধারণ করুন',
    doctorName: 'ডাক্তারের নাম',
    hospitalClinic: 'হাসপাতাল / ক্লিনিক',
    dateTime: 'তারিখ ও সময়',
    reasonForVisit: 'পরিদর্শনের কারণ',
    scheduledTime: 'নির্ধারিত সময়',
    noVisitsTitle: 'কোনো নির্ধারিত পরিদর্শন নেই',
    noVisitsDesc: 'উপরের বোতামটি ব্যবহার করে অ্যাপয়েন্টমেন্ট নিন।',
    apptSuccessMsg: 'অ্যাপয়েন্টমেন্ট সফলভাবে নির্ধারিত হয়েছে:',
    confirmedSlot: 'নিশ্চিত স্লট',

    assistantTitle: 'এআই স্বাস্থ্য কোপাইলট',
    assistantSubtitle: 'আপনার ল্যাব রিপোর্ট এবং ওষুধ সম্পর্কে প্রশ্ন জিজ্ঞাসা করুন।',
    askPlaceholder: 'হিমোগ্লোবিন, ব্লাড সুগার বা ওষুধ সম্পর্কে জিজ্ঞাসা করুন...',
    sendBtn: 'পাঠান',
    aiDisclaimer: 'হেলথএক্স এআই শুধুমাত্র তথ্যের জন্য। চিকিৎসার জন্য ডাক্তারের পরামর্শ নিন।',
    suggestedQuestions: 'প্রস্তাবিত প্রশ্নাবলী',

    labsTitle: 'ল্যাব গোয়েন্দা ও বায়োমার্কার',
    labsSubtitle: 'রক্তের গণনা এবং অঙ্গের কার্যকারিতা পর্যবেক্ষণ করুন',
    statusNormal: 'স্বাভাবিক',
    statusLow: 'কম',
    statusHigh: 'উচ্চ',
    statusCritical: 'গুরুতর',

    medsTitle: 'ওষুধ ও প্রেসক্রিপশন',
    medsSubtitle: 'চলতি ওষুধ, মাত্রা এবং সময়সূচী',
    addMedication: 'ওষুধ যোগ করুন',

    emergencyTitle: 'জরুরী মেডিকেল প্রোফাইল',
    emergencySubtitle: 'জরুরী কর্মী এবং ডাক্তারদের জন্য তাত্ক্ষণিক পরিচয়পত্র',
    bloodGroup: 'রক্তের গ্রুপ',
    allergies: 'অ্যালার্জি',
    emergencyContact: 'জরুরী যোগাযোগ',

    featureRecordIntelligence: 'মেডিকেল রেকর্ড বুদ্ধিমত্তা',
    featureCopilot: 'এআই স্বাস্থ্য সহকারী',
    featureJourney: 'সমন্বিত স্বাস্থ্য যাত্রা',
    featureLabs: 'ল্যাব বুদ্ধিমত্তা',
    featureDoctorVisit: 'ডাক্তার পরিদর্শন মোড',
    featureConsent: 'সম্মতি-ভিত্তিক ভাগাভাগি',
  },

  // ==========================================
  // KANNADA (ಕನ್ನಡ)
  // ==========================================
  kn: {
    appName: 'ಹೆಲ್ತ್ಎಕ್ಸ್ ಎಐ',
    tagline: 'ನಿಮ್ಮ ಆರೋಗ್ಯ. ಸಂಪರ್ಕಿತ. ಅರ್ಥವಾಗುವಂತಿದೆ.',
    heroSub: 'ಚದುರಿದ ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳನ್ನು ಅರ್ಥವಾಗುವ ಆರೋಗ್ಯ ಪ್ರಯಾಣವಾಗಿ ಪರಿವರ್ತಿಸಿ.',
    personalCopilot: 'ವೈಯಕ್ತಿಕ ಆರೋಗ್ಯ ಸಹಾಯಕ',
    language: 'ಭಾಷೆ',

    navHome: 'ಮುಖಪುಟ',
    navJourney: 'ಆರೋಗ್ಯ ಪ್ರಯಾಣ',
    navRecords: 'ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳು',
    navCopilot: 'ಎಐ ಸಹಾಯಕ',
    navLabs: 'ಲ್ಯಾಬ್ ಫಲಿತಾಂಶಗಳು',
    navMedications: 'ಔಷಧಿಗಳು',
    navAppointments: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು',
    navDoctors: 'ವೈದ್ಯರು & ಆಸ್ಪತ್ರೆಗಳು',
    navDoctorVisit: 'ವೈದ್ಯರ ಭೇಟಿ ಮೋಡ್',
    navEmergency: 'ತುರ್ತು ಪರಿಸ್ಥಿತಿ',
    navPrivacy: 'ಗೌಪ್ಯತೆ & ಒಪ್ಪಿಗೆ',
    navProfile: 'ಪ್ರೊಫೈಲ್',
    navSettings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',

    switchPortal: 'ಪೋರ್ಟಲ್ ಬದಲಾಯಿಸಿ',
    doctorPortal: 'ವೈದ್ಯರ ಪೋರ್ಟಲ್',
    hospitalPortal: 'ಆಸ್ಪತ್ರೆ ಪೋರ್ಟಲ್',
    patientPortal: 'ರೋಗಿಯ ಪೋರ್ಟಲ್',
    mlRegistry: 'ಎಂಎಲ್ ನೋಂದಣಿ',
    signOut: 'ಸೈನ್ ಔಟ್',

    scheduleVisit: 'ಭೇಟಿ ನಿಗದಿಪಡಿಸಿ',
    confirmAppointment: 'ದೃಢೀಕರಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    cancelVisit: 'ಭೇಟಿ ರದ್ದುಮಾಡಿ',
    confirm: 'ಖಚಿತಪಡಿಸಿ',
    save: 'ಉಳಿಸಿ',
    uploadDocument: 'ದಾಖಲೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    delete: 'ಅಳಿಸಿ',
    viewDetails: 'ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    search: 'ಹುಡುಕಿ',
    filter: 'ಫಿಲ್ಟರ್',
    close: 'ಮುಚ್ಚಿ',
    getStarted: 'ಪ್ರಾರಂಭಿಸಿ',
    exploreHealthx: 'ಅನ್ವೇಷಿಸಿ',
    loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',

    apptsTitle: 'ಕ್ಲಿನಿಕಲ್ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು & ಸಮಾಲೋಚನೆ',
    apptsSubtitle: 'ಆಸ್ಪತ್ರೆಯ ಭೇಟಿಗಳು ಮತ್ತು ಸಮಾಲೋಚನಾ ಟಿಪ್ಪಣಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
    scheduleApptTitle: 'ವೈದ್ಯಕೀಯ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ನಿಗದಿಪಡಿಸಿ',
    doctorName: 'ವೈದ್ಯರ ಹೆಸರು',
    hospitalClinic: 'ಆಸ್ಪತ್ರೆ / ಕ್ಲಿನಿಕ್',
    dateTime: 'ದಿನಾಂಕ & ಸಮಯ',
    reasonForVisit: 'ಭೇಟಿಯ ಕಾರಣ',
    scheduledTime: 'ನಿಗದಿತ ಸಮಯ',
    noVisitsTitle: 'ಯಾವುದೇ ಭೇಟಿಗಳು ನಿಗದಿಯಾಗಿಲ್ಲ',
    noVisitsDesc: 'ಮೇಲಿನ ಬಟನ್ ಬಳಸಿ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ.',
    apptSuccessMsg: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಯಶಸ್ವಿಯಾಗಿ ನಿಗದಿಯಾಗಿದೆ:',
    confirmedSlot: 'ದೃಢೀಕರಿಸಿದ ಸ್ಲಾಟ್',

    assistantTitle: 'ಎಐ ಆರೋಗ್ಯ ಸಹಾಯಕ',
    assistantSubtitle: 'ಲ್ಯಾಬ್ ಫಲಿತಾಂಶಗಳು ಮತ್ತು ಔಷಧಿಗಳ ಬಗ್ಗೆ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ.',
    askPlaceholder: 'ಹಿಮೋಗ್ಲೋಬಿನ್, ಸಕ್ಕರೆ ಮಟ್ಟ ಅಥವಾ ಔಷಧಿಗಳ ಬಗ್ಗೆ ಕೇಳಿ...',
    sendBtn: 'ಕಳುಹಿಸಿ',
    aiDisclaimer: 'ಹೆಲ್ತ್ಎಕ್ಸ್ ಎಐ ಕೇವಲ ಮಾಹಿತಿ ನೀಡುವ ಸಹಾಯಕ, ವೈದ್ಯರಲ್ಲ.',
    suggestedQuestions: 'ಸೂಚಿಸಲಾದ ಪ್ರಶ್ನೆಗಳು',

    labsTitle: 'ಲ್ಯಾಬ್ ಇಂಟೆಲಿಜೆನ್ಸ್',
    labsSubtitle: 'ರಕ್ತ ಕಣಗಳು ಮತ್ತು ಅಂಗಗಳ ಕಾರ್ಯಕ್ಷಮತೆಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    statusNormal: 'ಸಾಮಾನ್ಯ',
    statusLow: 'ಕಡಿಮೆ',
    statusHigh: 'ಹೆಚ್ಚು',
    statusCritical: 'ಗಂಭೀರ',

    medsTitle: 'ಔಷಧಿಗಳು & ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ಗಳು',
    medsSubtitle: 'ಪ್ರಸ್ತುತ ಔಷಧಿಗಳು ಮತ್ತು ಪ್ರಮಾಣ',
    addMedication: 'ಔಷಧಿ ಸೇರಿಸಿ',

    emergencyTitle: 'ತುರ್ತು ವೈದ್ಯಕೀಯ ಪ್ರೊಫೈಲ್',
    emergencySubtitle: 'ತುರ್ತು ಸಿಬ್ಬಂದಿಗಾಗಿ ವೈದ್ಯಕೀಯ ಗುರುತಿನ ಚೀಟಿ',
    bloodGroup: 'ರಕ್ತದ ಗುಂಪು',
    allergies: 'ಅಲರ್ಜಿಗಳು',
    emergencyContact: 'ತುರ್ತು ಸಂಪರ್ಕ',

    featureRecordIntelligence: 'ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳ ಬುದ್ಧಿಮತ್ತೆ',
    featureCopilot: 'ಎಐ ಆರೋಗ್ಯ ಸಹಾಯಕ',
    featureJourney: 'ಏಕೀಕೃತ ಆರೋಗ್ಯ ಪ್ರಯಾಣ',
    featureLabs: 'ಲ್ಯಾಬ್ ಇಂಟೆಲಿಜೆನ್ಸ್',
    featureDoctorVisit: 'ವೈದ್ಯರ ಭೇಟಿ ಮೋಡ್',
    featureConsent: 'ಒಪ್ಪಿಗೆ ಆಧಾರಿತ ಹಂಚಿಕೆ',
  },

  // ==========================================
  // MALAYALAM (മലയാളം)
  // ==========================================
  ml: {
    appName: 'ഹെൽത്ത് എക്സ് എഐ',
    tagline: 'നിങ്ങളുടെ ആരോഗ്യം. ബന്ധിപ്പിച്ചത്. മനസ്സിലാക്കിയത്.',
    heroSub: 'ചിതറിക്കിടക്കുന്ന മെഡിക്കൽ രേഖകളെ മനസ്സിലാക്കാവുന്ന ആരോഗ്യ യാത്രയാക്കി മാറ്റുക.',
    personalCopilot: 'വ്യക്തിഗത ആരോഗ്യ സഹായി',
    language: 'ഭാഷ',

    navHome: 'ഹോം',
    navJourney: 'ആരോഗ്യ യാത്ര',
    navRecords: 'മെഡിക്കൽ രേഖകൾ',
    navCopilot: 'എഐ സഹായി',
    navLabs: 'ലാബ് ഫലങ്ങൾ',
    navMedications: 'മരുന്നുകൾ',
    navAppointments: 'അപ്പോയിന്റ്മെന്റുകൾ',
    navDoctors: 'ഡോക്ടർമാരും ആശുപത്രികളും',
    navDoctorVisit: 'ഡോക്ടർ സന്ദർശന മോഡ്',
    navEmergency: 'അടിയന്തരാവസ്ഥ',
    navPrivacy: 'സ്വകാര്യതയും സമ്മതവും',
    navProfile: 'പ്രൊഫൈൽ',
    navSettings: 'ക്രമീകരണങ്ങൾ',

    switchPortal: 'പോർട്ടൽ മാറ്റുക',
    doctorPortal: 'ഡോക്ടർ പോർട്ടൽ',
    hospitalPortal: 'ഹോസ്പിറ്റൽ പോർട്ടൽ',
    patientPortal: 'രോഗി പോർട്ടൽ',
    mlRegistry: 'എംഎൽ രജിസ്ട്രി',
    signOut: 'സൈൻ ഔട്ട്',

    scheduleVisit: 'സന്ദർശനം നിശ്ചയിക്കുക',
    confirmAppointment: 'ഉറപ്പാക്കുക',
    cancel: 'റദ്ദാക്കുക',
    cancelVisit: 'സന്ദർശനം റദ്ദാക്കുക',
    confirm: 'സ്ഥിരീകരിക്കുക',
    save: 'സേവ് ചെയ്യുക',
    uploadDocument: 'രേഖ അപ്‌ലോഡ് ചെയ്യുക',
    delete: 'ഡിലീറ്റ് ചെയ്യുക',
    viewDetails: 'വിശദാംശങ്ങൾ കാണുക',
    search: 'തിരയുക',
    filter: 'ഫിൽട്ടർ',
    close: 'അടയ്ക്കുക',
    getStarted: 'ആരംഭിക്കുക',
    exploreHealthx: 'പര്യവേക്ഷണം ചെയ്യുക',
    loading: 'ലോഡ് ചെയ്യുന്നു...',

    apptsTitle: 'ക്ലിനിക്കൽ അപ്പോയിന്റ്മെന്റുകൾ',
    apptsSubtitle: 'ആശുപത്രി സന്ദർശനങ്ങളും ഫോളോ-അപ്പ് തീയതികളും കൈകാര്യം ചെയ്യുക',
    scheduleApptTitle: 'അപ്പോയിന്റ്മെന്റ് ഷെഡ്യൂൾ ചെയ്യുക',
    doctorName: 'ഡോക്ടറുടെ പേര്',
    hospitalClinic: 'ആശുപത്രി / ക്ലിനിക്ക്',
    dateTime: 'തീയതിയും സമയവും',
    reasonForVisit: 'സന്ദർശന കാരണം',
    scheduledTime: 'നിശ്ചയിച്ച സമയം',
    noVisitsTitle: 'സന്ദർശനങ്ങൾ ഷെഡ്യൂൾ ചെയ്തിട്ടില്ല',
    noVisitsDesc: 'മുകളിലുള്ള ബട്ടൺ ഉപയോഗിച്ച് അപ്പോയിന്റ്മെന്റ് എടുക്കുക.',
    apptSuccessMsg: 'അപ്പോയിന്റ്മെന്റ് വിജയകരമായി ഷെഡ്യൂൾ ചെയ്തു:',
    confirmedSlot: 'സ്ഥിരീകരിച്ച സ്ലോട്ട്',

    assistantTitle: 'എഐ ഹെൽത്ത് കോപൈലറ്റ്',
    assistantSubtitle: 'ലാബ് ഫലങ്ങളെയും മരുന്നുകളെയും കുറിച്ച് സംശയങ്ങൾ ചോദിക്കുക.',
    askPlaceholder: 'ഹീമോഗ്ലോബിൻ, ഷുഗർ, മരുന്നുകൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കുക...',
    sendBtn: 'അയക്കുക',
    aiDisclaimer: 'ഹെൽത്ത് എക്സ് എഐ ഒരു സഹായി മാത്രമാണ്, ഡോക്ടറല്ല.',
    suggestedQuestions: 'നിർദ്ദേശിച്ച ചോദ്യങ്ങൾ',

    labsTitle: 'ലാബ് ഇന്റലിജൻസ്',
    labsSubtitle: 'രക്തകോശങ്ങളും അവയവങ്ങളുടെ പ്രവർത്തനങ്ങളും നിരീക്ഷിക്കുക',
    statusNormal: 'സാധാരണം',
    statusLow: 'കുറവ്',
    statusHigh: 'കൂടുതൽ',
    statusCritical: 'ഗുരുതരം',

    medsTitle: 'മരുന്നുകളും കുറിപ്പടികളും',
    medsSubtitle: 'നിലവിലെ മരുന്നുകളും ഡോസേജ് വിവരങ്ങളും',
    addMedication: 'മരുന്ന് ചേർക്കുക',

    emergencyTitle: 'അടിയന്തര മെഡിക്കൽ പ്രൊഫൈൽ',
    emergencySubtitle: 'ആരോഗ്യ പ്രവർത്തകർക്കായുള്ള തിരിച്ചറിയൽ കാർഡ്',
    bloodGroup: 'രക്ത ഗ്രൂപ്പ്',
    allergies: 'അലർജികൾ',
    emergencyContact: 'അടിയന്തര കോൺടാക്റ്റ്',

    featureRecordIntelligence: 'മെഡിക്കൽ റെക്കോർഡ് ഇന്റലിജൻസ്',
    featureCopilot: 'എഐ ആരോഗ്യ സഹായി',
    featureJourney: 'ഏകീകൃത ആരോഗ്യ യാത്ര',
    featureLabs: 'ലാബ് ഇന്റലിജൻസ്',
    featureDoctorVisit: 'ഡോക്ടർ സന്ദർശന മോഡ്',
    featureConsent: 'സമ്മതപത്ര പങ്കിടൽ',
  },

  // ==========================================
  // PUNJABI (ਪੰਜਾਬੀ)
  // ==========================================
  pa: {
    appName: 'ਹੈਲਥਐਕਸ ਏਆਈ',
    tagline: 'ਤੁਹਾਡੀ ਸਿਹਤ। ਜੁੜੀ ਹੋਈ। ਸਮਝੀ ਹੋਈ।',
    heroSub: 'ਖਿੰਡੇ ਹੋਏ ਮੈਡੀਕਲ ਰਿਕਾਰਡਾਂ ਨੂੰ ਇੱਕ ਸਮਝਣਯੋਗ ਸਿਹਤ ਯਾਤਰਾ ਵਿੱਚ ਬਦਲੋ।',
    personalCopilot: 'ਨਿੱਜੀ ਸਿਹਤ ਸਹਾਇਕ',
    language: 'ਭਾਸ਼ਾ',

    navHome: 'ਹੋਮ',
    navJourney: 'ਸਿਹਤ ਯਾਤਰਾ',
    navRecords: 'ਮੈਡੀਕਲ ਰਿਕਾਰਡ',
    navCopilot: 'ਏਆਈ ਸਹਾਇਕ',
    navLabs: 'ਲੈਬ ਨਤੀਜੇ',
    navMedications: 'ਦਵਾਈਆਂ',
    navAppointments: 'ਮੁਲਾਕਾਤਾਂ',
    navDoctors: 'ਡਾਕਟਰ ਅਤੇ ਹਸਪਤਾਲ',
    navDoctorVisit: 'ਡਾਕਟਰ ਵਿਜ਼ਿਟ ਮੋਡ',
    navEmergency: 'ਐਮਰਜੈਂਸੀ',
    navPrivacy: 'ਗੋਪਨੀਯਤਾ ਅਤੇ ਸਹਿਮਤੀ',
    navProfile: 'ਪ੍ਰੋਫਾਈਲ',
    navSettings: 'ਸੈਟਿੰਗਾਂ',

    switchPortal: 'ਪੋਰਟਲ ਬਦਲੋ',
    doctorPortal: 'ਡਾਕਟਰ ਪੋਰਟਲ',
    hospitalPortal: 'ਹਸਪਤਾਲ ਪੋਰਟਲ',
    patientPortal: 'ਮਰੀਜ਼ ਪੋਰਟਲ',
    mlRegistry: 'ਐਮਐਲ ਰਜਿਸਟਰੀ',
    signOut: 'ਸਾਈਨ ਆਉਟ',

    scheduleVisit: 'ਮੁਲਾਕਾਤ ਤੈਅ ਕਰੋ',
    confirmAppointment: 'ਪੁਸ਼ਟੀ ਕਰੋ',
    cancel: 'ਰੱਦ ਕਰੋ',
    cancelVisit: 'ਮੁਲਾਕਾਤ ਰੱਦ ਕਰੋ',
    confirm: 'ਪੁਸ਼ਟੀ ਕਰੋ',
    save: 'ਸੇਵ ਕਰੋ',
    uploadDocument: 'ਦਸਤਾਵੇਜ਼ ਅੱਪਲੋਡ ਕਰੋ',
    delete: 'ਹਟਾਓ',
    viewDetails: 'ਵੇਰਵੇ ਦੇਖੋ',
    search: 'ਖੋਜੋ',
    filter: 'ਫਿਲਟਰ',
    close: 'ਬੰਦ ਕਰੋ',
    getStarted: 'ਸ਼ੁਰੂ ਕਰੋ',
    exploreHealthx: 'ਐਕਸਪਲੋਰ ਕਰੋ',
    loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',

    apptsTitle: 'ਕਲੀਨਿਕਲ ਮੁਲਾਕਾਤਾਂ ਅਤੇ ਸਲਾਹ',
    apptsSubtitle: 'ਆਉਣ ਵਾਲੀਆਂ ਹਸਪਤਾਲ ਫੇਰੀਆਂ ਅਤੇ ਸਲਾਹ ਨੋਟਸ ਪ੍ਰਬੰਧਿਤ ਕਰੋ',
    scheduleApptTitle: 'ਮੈਡੀਕਲ ਮੁਲਾਕਾਤ ਤੈਅ ਕਰੋ',
    doctorName: 'ਡਾਕਟਰ ਦਾ ਨਾਮ',
    hospitalClinic: 'ਹਸਪਤਾਲ / ਕਲੀਨਿਕ',
    dateTime: 'ਮਿਤੀ ਅਤੇ ਸਮਾਂ',
    reasonForVisit: 'ਫੇਰੀ ਦਾ ਕਾਰਨ',
    scheduledTime: 'ਨਿਰਧਾਰਤ ਸਮਾਂ',
    noVisitsTitle: 'ਕੋਈ ਤੈਅ ਮੁਲਾਕਾਤ ਨਹੀਂ ਹੈ',
    noVisitsDesc: 'ਉੱਪਰ ਦਿੱਤੇ ਬਟਨ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਮੁਲਾਕਾਤ ਤੈਅ ਕਰੋ।',
    apptSuccessMsg: 'ਮੁਲਾਕਾਤ ਸਫਲਤਾਪੂਰਵਕ ਤੈਅ ਹੋਈ:',
    confirmedSlot: 'ਪੁਸ਼ਟ ਸਲਾਟ',

    assistantTitle: 'ਏਆਈ ਹੈਲਥ ਕੋਪਾਇਲਟ',
    assistantSubtitle: 'ਲੈਬ ਨਤੀਜਿਆਂ ਅਤੇ ਦਵਾਈਆਂ ਬਾਰੇ ਸਵਾਲ ਪੁੱਛੋ।',
    askPlaceholder: 'ਹੀਮੋਗਲੋਬਿਨ, ਸ਼ੂਗਰ ਜਾਂ ਦਵਾਈਆਂ ਬਾਰੇ ਪੁੱਛੋ...',
    sendBtn: 'ਭੇਜੋ',
    aiDisclaimer: 'ਹੈਲਥਐਕਸ ਏਆਈ ਸਿਰਫ ਜਾਣਕਾਰੀ ਲਈ ਹੈ, ਡਾਕਟਰ ਨਹੀਂ।',
    suggestedQuestions: 'ਸੁਝਾਏ ਗਏ ਸਵਾਲ',

    labsTitle: 'ਲੈਬ ਇੰਟੈਲੀਜੈਂਸ',
    labsSubtitle: 'ਖੂਨ ਦੇ ਸੈੱਲ ਅਤੇ ਅੰਗਾਂ ਦੀ ਕਾਰਜਕੁਸ਼ਲਤਾ ਟ੍ਰੈਕ ਕਰੋ',
    statusNormal: 'ਆਮ',
    statusLow: 'ਘੱਟ',
    statusHigh: 'ਵੱਧ',
    statusCritical: 'ਗੰਭੀਰ',

    medsTitle: 'ਦਵਾਈਆਂ ਅਤੇ ਪਰਚੀਆਂ',
    medsSubtitle: 'ਮੌਜੂਦਾ ਦਵਾਈਆਂ ਅਤੇ ਖੁਰਾਕ ਵੇਰਵੇ',
    addMedication: 'ਦਵਾਈ ਸ਼ਾਮਲ ਕਰੋ',

    emergencyTitle: 'ਐਮਰਜੈਂਸੀ ਮੈਡੀਕਲ ਪ੍ਰੋਫਾਈਲ',
    emergencySubtitle: 'ਐਮਰਜੈਂਸੀ ਕਰਮਚਾਰੀਆਂ ਲਈ ਪਛਾਣ ਪੱਤਰ',
    bloodGroup: 'ਬਲੱਡ ਗਰੁੱਪ',
    allergies: 'ਐਲਰਜੀ',
    emergencyContact: 'ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ',

    featureRecordIntelligence: 'ਮੈਡੀਕਲ ਰਿਕਾਰਡ ਇੰਟੈਲੀਜੈਂਸ',
    featureCopilot: 'ਏਆਈ ਹੈਲਥ ਕੋਪਾਇਲਟ',
    featureJourney: 'ਏਕੀਕ੍ਰਿਤ ਸਿਹਤ ਯਾਤਰਾ',
    featureLabs: 'ਲੈਬ ਇੰਟੈਲੀਜੈਂਸ',
    featureDoctorVisit: 'ਡਾਕਟਰ ਵਿਜ਼ਿਟ ਮੋਡ',
    featureConsent: 'ਸਹਿਮਤੀ ਅਧਾਰਤ ਸਾਂਝਾਕਰਨ',
  },
};
