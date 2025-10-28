import React, { useState } from 'react';
import { AlertCircle, ClipboardList, Stethoscope } from 'lucide-react';

export default function MenopauseConsultation() {
  const [formData, setFormData] = useState({
    patientName: '',
    dob: '',
    consultDate: new Date().toISOString().split('T')[0],
    consultType: '',
    
    // Presenting complaints
    menstrualChanges: false,
    hotFlushes: false,
    moodDisturbance: false,
    sleepIssues: false,
    vaginalDryness: false,
    weightChanges: false,
    brainFog: false,
    otherComplaint: '',
    
    // Menstrual history
    menarche: '',
    cycleRegularity: '',
    lmp: '',
    recentChanges: [],
    
    // Vasomotor
    hasHotFlushes: '',
    flushFrequency: '',
    hasNightSweats: '',
    sweatsDisturbSleep: '',
    
    // Psychological
    moodIssues: '',
    sleepQuality: '',
    cognitiveIssues: '',
    
    // Urogenital
    vaginalSymptoms: '',
    dyspareunia: '',
    urinarySymptoms: '',
    
    // Other systemic
    fatigue: false,
    jointAches: false,
    headaches: false,
    libidoChanges: false,
    
    // Medical history
    medicalHistory: [],
    currentMeds: '',
    allergies: '',
    
    // Family history
    familyCancer: '',
    familyCVD: '',
    familyOsteoporosis: '',
    
    // Lifestyle
    smoking: '',
    smokingAmount: '',
    alcohol: '',
    exercise: '',
    bmi: '',
    stressLevel: ''
  });

  const [showResults, setShowResults] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckbox = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => {
      const current = prev[field] || [];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(v => v !== value) };
      }
      return { ...prev, [field]: [...current, value] };
    });
  };

  const generateInvestigations = () => {
    const investigations = [];
    const age = formData.dob ? new Date().getFullYear() - new Date(formData.dob).getFullYear() : 0;
    
    // Basic investigations
    if (age < 45 || formData.cycleRegularity === 'irregular') {
      investigations.push('FSH, LH, Estradiol (to confirm menopausal status)');
    }
    
    investigations.push('Thyroid function tests (TSH, fT4) - exclude thyroid dysfunction');
    
    if (formData.moodIssues === 'yes' || formData.menstrualChanges) {
      investigations.push('Prolactin level');
    }
    
    if (formData.fatigue || formData.weightChanges) {
      investigations.push('Full blood count, Iron studies');
      investigations.push('HbA1c, Fasting glucose');
      investigations.push('Lipid profile');
    }
    
    if (age >= 45 || formData.medicalHistory.includes('osteoporosis') || formData.familyOsteoporosis === 'yes') {
      investigations.push('Bone density scan (DEXA) - assess fracture risk');
      investigations.push('Vitamin D level, Calcium');
    }
    
    if (formData.medicalHistory.includes('cvd') || formData.familyCVD === 'yes' || formData.smoking === 'yes') {
      investigations.push('Cardiovascular risk assessment');
      investigations.push('Blood pressure monitoring');
    }
    
    investigations.push('Cervical screening - ensure up to date');
    if (age >= 40) {
      investigations.push('Mammogram - as per screening guidelines');
    }
    
    if (formData.vaginalSymptoms === 'yes' || formData.urinarySymptoms === 'yes') {
      investigations.push('Urine microscopy & culture (if UTI symptoms)');
      investigations.push('Consider vaginal pH/swab if infection suspected');
    }

    return investigations;
  };

  const generateManagementPlan = () => {
    const plan = {
      hrt: [],
      nonPharm: [],
      lifestyle: [],
      monitoring: [],
      referrals: []
    };

    const age = formData.dob ? new Date().getFullYear() - new Date(formData.dob).getFullYear() : 0;
    const contraindications = formData.medicalHistory;

    // HRT considerations
    if (!contraindications.includes('breastCancer') && !contraindications.includes('endometrialCancer') && !contraindications.includes('vte')) {
      if (formData.hasHotFlushes === 'yes' || formData.hasNightSweats === 'yes') {
        if (formData.recentChanges.includes('none') || formData.lmp === '') {
          plan.hrt.push('Consider combined HRT (oestrogen + progestogen) - patient has intact uterus');
        } else {
          plan.hrt.push('Discuss combined HRT vs oestrogen-only (if post-hysterectomy)');
        }
        plan.hrt.push('Recommend transdermal oestrogen (lower VTE risk) - patches or gel');
        plan.hrt.push('Start low dose, titrate as needed');
      }
    } else {
      plan.nonPharm.push('HRT contraindicated - discuss alternative options');
    }

    if (formData.vaginalSymptoms === 'yes' || formData.dyspareunia === 'yes') {
      plan.hrt.push('Topical vaginal oestrogen (safe even with HRT contraindications)');
      plan.hrt.push('Vaginal moisturizers and lubricants');
    }

    // Non-pharmacological
    if (formData.hasHotFlushes === 'yes' || formData.moodIssues === 'yes') {
      plan.nonPharm.push('Cognitive Behavioural Therapy (CBT) - evidence-based for hot flushes and mood');
    }

    if (contraindications.includes('breastCancer') || formData.medicalHistory.includes('breastCancer')) {
      plan.nonPharm.push('Consider SSRI/SNRI (e.g., venlafaxine, citalopram) for vasomotor symptoms');
    }

    if (formData.moodIssues === 'yes') {
      plan.nonPharm.push('Consider SSRI/SNRI if significant anxiety/depression');
      plan.referrals.push('Psychology/psychiatry referral if moderate-severe mood symptoms');
    }

    // Lifestyle
    plan.lifestyle.push('Regular weight-bearing exercise (bone health, mood, weight management)');
    plan.lifestyle.push('Balanced diet rich in calcium and vitamin D');
    
    if (formData.smoking === 'yes') {
      plan.lifestyle.push('SMOKING CESSATION - priority intervention');
    }

    if (formData.alcohol && formData.alcohol !== 'none') {
      plan.lifestyle.push('Alcohol reduction - recommend ≤10 standard drinks/week');
    }

    if (formData.stressLevel === 'high') {
      plan.lifestyle.push('Stress management techniques - mindfulness, relaxation');
    }

    plan.lifestyle.push('Sleep hygiene - cool room, regular schedule, limit caffeine');

    // Monitoring
    if (plan.hrt.length > 0) {
      plan.monitoring.push('Review in 6 weeks after starting HRT (assess symptoms, side effects)');
      plan.monitoring.push('3-monthly reviews until stable, then 6-12 monthly');
      plan.monitoring.push('Annual BP, BMI, breast awareness education');
    }

    if (formData.medicalHistory.includes('osteoporosis') || age >= 50) {
      plan.monitoring.push('Bone density monitoring every 2-3 years');
    }

    // Contraception
    if (age < 50 && formData.lmp !== '') {
      const monthsSinceLMP = formData.lmp ? 
        Math.floor((new Date() - new Date(formData.lmp)) / (1000 * 60 * 60 * 24 * 30)) : 0;
      
      if (monthsSinceLMP < 12) {
        plan.monitoring.push('CONTRACEPTION still required (amenorrhoea <12 months if age >50, <24 months if age <50)');
      }
    }

    return plan;
  };

  const handleGenerateResults = () => {
    setShowResults(true);
    // Scroll to results after a brief delay
    setTimeout(() => {
      const resultsElement = document.getElementById('results-section');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleGenerateResults();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-purple-900 mb-2 flex items-center gap-2">
          <Stethoscope className="w-8 h-8" />
          Menopause/Perimenopause Consultation
        </h1>
        <p className="text-gray-600 mb-6">20+ minutes consultation template with AI-powered recommendations</p>

        <form className="space-y-6">
          {/* Patient Details */}
          <section className="border-l-4 border-purple-500 pl-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Patient Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  value={formData.patientName}
                  onChange={(e) => handleChange('patientName', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth *</label>
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) => handleChange('dob', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Consultation Date</label>
                <input
                  type="date"
                  value={formData.consultDate}
                  onChange={(e) => handleChange('consultDate', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Consultation Type *</label>
                <select
                  required
                  value={formData.consultType}
                  onChange={(e) => handleChange('consultType', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select...</option>
                  <option value="inperson">In-Person</option>
                  <option value="telehealth">Telehealth</option>
                </select>
              </div>
            </div>
          </section>

          {/* Presenting Complaint */}
          <section className="border-l-4 border-pink-500 pl-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Presenting Complaint</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { key: 'menstrualChanges', label: 'Menstrual changes' },
                { key: 'hotFlushes', label: 'Hot flushes / night sweats' },
                { key: 'moodDisturbance', label: 'Mood disturbance' },
                { key: 'sleepIssues', label: 'Sleep issues' },
                { key: 'vaginalDryness', label: 'Vaginal dryness / sexual discomfort' },
                { key: 'weightChanges', label: 'Weight changes / fatigue' },
                { key: 'brainFog', label: 'Brain fog / concentration issues' }
              ].map(item => (
                <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData[item.key]}
                    onChange={() => handleCheckbox(item.key)}
                    className="w-4 h-4"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">Other symptoms</label>
              <input
                type="text"
                value={formData.otherComplaint}
                onChange={(e) => handleChange('otherComplaint', e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Describe any other symptoms..."
              />
            </div>
          </section>

          {/* Menstrual History */}
          <section className="border-l-4 border-purple-500 pl-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Menstrual History</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Age of Menarche</label>
                <input
                  type="number"
                  min="8"
                  max="20"
                  value={formData.menarche}
                  onChange={(e) => handleChange('menarche', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cycle Regularity</label>
                <select
                  value={formData.cycleRegularity}
                  onChange={(e) => handleChange('cycleRegularity', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select...</option>
                  <option value="regular">Previously regular, now regular</option>
                  <option value="irregular">Previously regular, now irregular</option>
                  <option value="alwaysIrregular">Always irregular</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Menstrual Period (LMP)</label>
                <input
                  type="date"
                  value={formData.lmp}
                  onChange={(e) => handleChange('lmp', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Recent Changes</label>
                <div className="space-y-1">
                  {['irregular', 'missed', 'heavy', 'none'].map(change => (
                    <label key={change} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.recentChanges.includes(change)}
                        onChange={() => handleMultiSelect('recentChanges', change)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm capitalize">{change === 'heavy' ? 'Heavy bleeding' : change === 'missed' ? 'Missed periods' : change}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Vasomotor Symptoms */}
          <section className="border-l-4 border-pink-500 pl-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Vasomotor Symptoms</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Hot Flushes?</label>
                <select
                  value={formData.hasHotFlushes}
                  onChange={(e) => handleChange('hasHotFlushes', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select...</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              {formData.hasHotFlushes === 'yes' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Frequency</label>
                  <select
                    value={formData.flushFrequency}
                    onChange={(e) => handleChange('flushFrequency', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select...</option>
                    <option value="occasional">Occasional (few per week)</option>
                    <option value="frequent">Frequent (daily)</option>
                    <option value="severe">Severe (multiple times per day)</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Night Sweats?</label>
                <select
                  value={formData.hasNightSweats}
                  onChange={(e) => handleChange('hasNightSweats', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select...</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              {formData.hasNightSweats === 'yes' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Disturbs Sleep?</label>
                  <select
                    value={formData.sweatsDisturbSleep}
                    onChange={(e) => handleChange('sweatsDisturbSleep', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              )}
            </div>
          </section>

          {/* Psychological Symptoms */}
          <section className="border-l-4 border-purple-500 pl-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Psychological Symptoms</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mood Issues (anxiety/low mood)?</label>
                <select
                  value={formData.moodIssues}
                  onChange={(e) => handleChange('moodIssues', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select...</option>
                  <option value="no">No</option>
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sleep Quality</label>
                <select
                  value={formData.sleepQuality}
                  onChange={(e) => handleChange('sleepQuality', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select...</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Brain Fog / Cognitive Issues?</label>
                <select
                  value={formData.cognitiveIssues}
                  onChange={(e) => handleChange('cognitiveIssues', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select...</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>
          </section>

          {/* Urogenital Symptoms */}
          <section className="border-l-4 border-pink-500 pl-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Urogenital Symptoms</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Vaginal Dryness/Irritation?</label>
                <select
                  value={formData.vaginalSymptoms}
                  onChange={(e) => handleChange('vaginalSymptoms', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select...</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pain with Sex (Dyspareunia)?</label>
                <select
                  value={formData.dyspareunia}
                  onChange={(e) => handleChange('dyspareunia', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select...</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Urinary Frequency/Urgency/UTIs?</label>
                <select
                  value={formData.urinarySymptoms}
                  onChange={(e) => handleChange('urinarySymptoms', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select...</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>
          </section>

          {/* Other Systemic Symptoms */}
          <section className="border-l-4 border-purple-500 pl-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Other Systemic Symptoms</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { key: 'fatigue', label: 'Fatigue / Weight Gain' },
                { key: 'jointAches', label: 'Joint Aches' },
                { key: 'headaches', label: 'Headaches' },
                { key: 'libidoChanges', label: 'Libido Changes' }
              ].map(item => (
                <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData[item.key]}
                    onChange={() => handleCheckbox(item.key)}
                    className="w-4 h-4"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Medical History */}
          <section className="border-l-4 border-pink-500 pl-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Relevant Medical History</h2>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-2">History of:</label>
              <div className="grid md:grid-cols-3 gap-2">
                {[
                  { key: 'breastCancer', label: 'Breast Cancer' },
                  { key: 'endometrialCancer', label: 'Endometrial Cancer' },
                  { key: 'vte', label: 'VTE' },
                  { key: 'cvd', label: 'CVD' },
                  { key: 'stroke', label: 'Stroke' },
                  { key: 'migraines', label: 'Migraines' },
                  { key: 'liverDisease', label: 'Liver Disease' },
                  { key: 'osteoporosis', label: 'Osteoporosis' },
                  { key: 'thyroid', label: 'Thyroid Dysfunction' }
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={formData.medicalHistory.includes(item.key)}
                      onChange={() => handleMultiSelect('medicalHistory', item.key)}
                      className="w-4 h-4"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Current Medications</label>
                <input
                  type="text"
                  value={formData.currentMeds}
                  onChange={(e) => handleChange('currentMeds', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="List current medications..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Allergies</label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => handleChange('allergies', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="List any allergies..."
                />
              </div>
            </div>
          </section>

          {/* Family History */}
          <section className="border-l-4 border-purple-500 pl-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Family History</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Breast/Ovarian/Endometrial Cancer?</label>
                <select
                  value={formData.familyCancer}
                  onChange={(e) => handleChange('familyCancer', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select...</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cardiovascular Disease?</label>
                <select
                  value={formData.familyCVD}
                  onChange={(e) => handleChange('familyCVD', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select...</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Osteoporosis?</label>
                <select
                  value={formData.familyOsteoporosis}
                  onChange={(e) => handleChange('familyOsteoporosis', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select...</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>
          </section>

          {/* Lifestyle Factors */}
          <section className="border-l-4 border-pink-500 pl-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Lifestyle Factors</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Smoking?</label>
                <select
                  value={formData.smoking}
                  onChange={(e) => handleChange('smoking', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select...</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                  <option value="former">Former smoker</option>
                </select>
              </div>
              {formData.smoking === 'yes' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Cigarettes per Day</label>
                  <input
                    type="number"
                    value={formData.smokingAmount}
                    onChange={(e) => handleChange('smokingAmount', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Alcohol Intake</label>
                <select
                  value={formData.alcohol}
                  onChange={(e) => handleChange('alcohol', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select...</option>
                  <option value="none">None</option>
                  <option value="light">Light (1-7 drinks/week)</option>
                  <option value="moderate">Moderate (8-14 drinks/week)</option>
                  <option value="heavy">Heavy (>14 drinks/week)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Physical Activity</label>
                <select
                  value={formData.exercise}
                  onChange={(e) => handleChange('exercise', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select...</option>
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light (1-2 days/week)</option>
                  <option value="moderate">Moderate (3-4 days/week)</option>
                  <option value="active">Active (5+ days/week)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">BMI (if known)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.bmi}
                  onChange={(e) => handleChange('bmi', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g., 24.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stress Level</label>
                <select
                  value={formData.stressLevel}
                  onChange={(e) => handleChange('stressLevel', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select...</option>
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </section>

          <button
            type="button"
            onClick={() => setShowResults(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
          >
            <ClipboardList className="w-5 h-5" />
            Generate Investigation Plan & Management Recommendations
          </button>
        </form>

        {showResults && (
          <div className="mt-8 space-y-6 animate-fade-in">
            {/* Investigations */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6" />
                Recommended Investigations
              </h2>
              <ul className="space-y-2">
                {generateInvestigations().map((inv, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span className="text-gray-800">{inv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Management Plan */}
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-2">
                <Stethoscope className="w-6 h-6" />
                Management Plan
              </h2>
              
              {generateManagementPlan().hrt.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Hormone Replacement Therapy</h3>
                  <ul className="space-y-1">
                    {generateManagementPlan().hrt.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-600 font-bold mt-1">→</span>
                        <span className="text-gray-800">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {generateManagementPlan().nonPharm.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Non-Pharmacological / Alternative Options</h3>
                  <ul className="space-y-1">
                    {generateManagementPlan().nonPharm.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-600 font-bold mt-1">→</span>
                        <span className="text-gray-800">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {generateManagementPlan().lifestyle.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Lifestyle Modifications</h3>
                  <ul className="space-y-1">
                    {generateManagementPlan().lifestyle.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-600 font-bold mt-1">→</span>
                        <span className="text-gray-800">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {generateManagementPlan().monitoring.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Monitoring & Follow-up</h3>
                  <ul className="space-y-1">
                    {generateManagementPlan().monitoring.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-600 font-bold mt-1">→</span>
                        <span className="text-gray-800">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {generateManagementPlan().referrals.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Referrals</h3>
                  <ul className="space-y-1">
                    {generateManagementPlan().referrals.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-600 font-bold mt-1">→</span>
                        <span className="text-gray-800">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Clinical Notes Summary */}
            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-purple-900 mb-4">Clinical Summary</h2>
              <div className="space-y-2 text-gray-800">
                <p><strong>Patient:</strong> {formData.patientName}, DOB: {formData.dob}</p>
                <p><strong>Age:</strong> {formData.dob ? new Date().getFullYear() - new Date(formData.dob).getFullYear() : 'N/A'} years</p>
                <p><strong>Consultation Date:</strong> {formData.consultDate}</p>
                <p><strong>Type:</strong> {formData.consultType === 'inperson' ? 'In-Person' : 'Telehealth'}</p>
                
                <div className="mt-4">
                  <strong>Key Symptoms:</strong>
                  <ul className="list-disc list-inside ml-4">
                    {formData.menstrualChanges && <li>Menstrual changes</li>}
                    {formData.hasHotFlushes === 'yes' && <li>Hot flushes ({formData.flushFrequency})</li>}
                    {formData.hasNightSweats === 'yes' && <li>Night sweats</li>}
                    {formData.moodIssues && formData.moodIssues !== 'no' && <li>Mood issues ({formData.moodIssues})</li>}
                    {formData.vaginalSymptoms === 'yes' && <li>Vaginal symptoms</li>}
                    {formData.cognitiveIssues === 'yes' && <li>Cognitive issues</li>}
                  </ul>
                </div>

                {formData.medicalHistory.length > 0 && (
                  <div className="mt-4">
                    <strong>Relevant Medical History:</strong>
                    <span className="ml-2">{formData.medicalHistory.map(h => h.replace(/([A-Z])/g, ' $1').trim()).join(', ')}</span>
                  </div>
                )}

                <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded">
                  <p className="text-sm text-yellow-900">
                    <strong>Note:</strong> This is an AI-generated clinical decision support tool. All recommendations should be reviewed and adapted based on individual patient assessment, clinical judgment, and current evidence-based guidelines. Always consider contraindications and patient preferences.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all"
            >
              Print Consultation Summary
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          .animate-fade-in, .animate-fade-in * {
            visibility: visible;
          }
          .animate-fade-in {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
}