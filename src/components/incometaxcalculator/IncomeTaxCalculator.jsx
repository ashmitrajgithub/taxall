import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import './IncomeTaxCalculator.css';

const IncomeTaxCalculator = () => {
  // Define the steps for our multi-step form.
  const steps = [
    { id: 1, label: 'Basic Details' },
    { id: 2, label: 'Income Details' },
    { id: 3, label: 'Deductions' },
    { id: 4, label: 'Summary Report' },
  ];

  // Manage the current step.
  const [step, setStep] = useState(1);

  // State for Basic Details.
  const [basicDetails, setBasicDetails] = useState({
    financialYear: '',
    ageGroup: '',
    applyStandardDeduction: 'yes',
  });

  // State for Income Details.
  const [incomeDetails, setIncomeDetails] = useState({
    salary: '',
    rentalIncome: '',
    interest: '',
    otherIncome: '',
    exemptAllowances: '',
    interestHomeLoanSelf: '',
    interestHomeLoanLetOut: '',
  });

  // State for Deductions.
  const [deductions, setDeductions] = useState({
    basicDeduction80C: '',
    medicalInsurance80D: '',
    donations80G: '',
    otherDeduction: '',
  });

  // State for the summary report.
  const [summary, setSummary] = useState(null);

  // Helper function to format currency.
  const formatCurrency = (value) => {
    const num = Number(value);
    if (num < 100000) {
      return `₹${num.toLocaleString('en-IN')}`;
    } else if (num < 10000000) {
      return `₹${(num / 100000).toFixed(2)} L`;
    } else {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
  };

  // Navigation functions.
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Input change handlers.
  const handleBasicChange = (e) => {
    setBasicDetails({ ...basicDetails, [e.target.name]: e.target.value });
  };
  const handleIncomeChange = (e) => {
    setIncomeDetails({ ...incomeDetails, [e.target.name]: e.target.value });
  };
  const handleDeductionChange = (e) => {
    setDeductions({ ...deductions, [e.target.name]: e.target.value });
  };

  // ================================
  // TAX CALCULATION FUNCTIONS
  // ================================

  // OLD REGIME TAX CALCULATION (remains unchanged)
  function calculateOldRegimeTax(taxableIncome) {
    if (taxableIncome <= 250000) return 0;
    if (taxableIncome <= 500000) return (taxableIncome - 250000) * 0.05;
    if (taxableIncome <= 1000000)
      return (taxableIncome - 500000) * 0.2 + 12500;
    return (taxableIncome - 1000000) * 0.3 + 112500;
  }

  // NEW REGIME TAX CALCULATION as per NEW SCHEME AFTER BUDGET 2025
  function calculateNewRegimeTax(taxableIncome) {
    // No standard deduction is allowed under the new regime.
    // -------------------------------
    // Slab 1: Up to ₹4,00,000 – 0%
    if (taxableIncome <= 400000) {
      return 0;
    }
    // -------------------------------
    // Slab 2: ₹4,00,001 to ₹8,00,000 – 5% on the amount exceeding ₹4,00,000.
    else if (taxableIncome <= 800000) {
      return (taxableIncome - 400000) * 0.05;
    }
    // -------------------------------
    // Slab 3: ₹8,00,001 to ₹12,00,000 – 10% on the amount exceeding ₹8,00,000
    // plus a fixed tax of ₹20,000 from the previous slab.
    else if (taxableIncome <= 1200000) {
      return ((taxableIncome - 800000) * 0.10) + 20000;
    }
    // -------------------------------
    // Slab 4: ₹12,00,001 to ₹16,00,000 – 15% on the amount exceeding ₹12,00,000
    // plus fixed amounts from earlier slabs (₹20,000 + ₹40,000 = ₹60,000).
    // However, marginal relief applies: the final tax should not exceed the extra income over ₹12,00,000.
    else if (taxableIncome <= 1600000) {
      // Computed tax without marginal relief.
      const computedTax = ((taxableIncome - 1200000) * 0.15) + 20000 + 40000; // 60000 + 15% of excess over 1,200,000
      // Marginal relief cap: the tax cannot be more than (taxableIncome - 1200000).
      const marginalCap = taxableIncome - 1200000;
      return Math.min(computedTax, marginalCap);
    }
    // -------------------------------
    // Slab 5: ₹16,00,001 to ₹20,00,000 – 20% on the amount exceeding ₹16,00,000
    // plus a fixed tax of ₹120,000 (i.e. cumulative tax up to ₹16,00,000).
    else if (taxableIncome <= 2000000) {
      return 120000 + (taxableIncome - 1600000) * 0.20;
    }
    // -------------------------------
    // Slab 6: ₹20,00,001 to ₹24,00,000 – 25% on the amount exceeding ₹20,00,000
    // plus a fixed tax of ₹200,000.
    else if (taxableIncome <= 2400000) {
      return 200000 + (taxableIncome - 2000000) * 0.25;
    }
    // -------------------------------
    // Slab 7: Above ₹24,00,000 – 30% on the amount exceeding ₹24,00,000
    // plus a fixed tax of ₹300,000.
    else {
      return 300000 + (taxableIncome - 2400000) * 0.30;
    }
  }

  // Main tax calculation function.
  const calculateTax = () => {
    // Convert income values to numbers.
    const salary = Number(incomeDetails.salary || 0);
    const rental = Number(incomeDetails.rentalIncome || 0);
    const interest = Number(incomeDetails.interest || 0);
    const otherIncome = Number(incomeDetails.otherIncome || 0);
    const totalA = salary + rental + interest + otherIncome;

    // Exemptions.
    const exemptions = Number(incomeDetails.exemptAllowances || 0);

    // Home loan interest.
    const homeLoanInterest =
      Number(incomeDetails.interestHomeLoanSelf || 0) +
      Number(incomeDetails.interestHomeLoanLetOut || 0);

    // Other deductions.
    const basicDeduction = Number(deductions.basicDeduction80C || 0);
    const medicalInsurance = Number(deductions.medicalInsurance80D || 0);
    const donations = Number(deductions.donations80G || 0);
    const otherDeduction = Number(deductions.otherDeduction || 0);
    const totalC =
      basicDeduction + medicalInsurance + donations + homeLoanInterest + otherDeduction;

    // Determine if the user opts for the standard deduction.
    const applyStandardDeduction = basicDetails.applyStandardDeduction === 'yes';
    const oldStandardDeduction = applyStandardDeduction ? 50000 : 0;
    // In the new regime, no standard deduction is allowed.
    const newStandardDeduction = 0;

    // Calculate taxable incomes.
    const oldTaxableIncome = Math.max(
      totalA - oldStandardDeduction - exemptions - totalC,
      0
    );
    // For the new regime, the entire income is taxable.
    const newTaxableIncome = Math.max(totalA - newStandardDeduction, 0);

    // Calculate tax liabilities using the respective functions.
    const oldCalculatedTax = calculateOldRegimeTax(oldTaxableIncome);
    const newCalculatedTax = calculateNewRegimeTax(newTaxableIncome);

    // Apply tax rebate if applicable.
    const oldTaxRebate = oldTaxableIncome <= 500000 ? -oldCalculatedTax : 0;
    const newTaxRebate = newTaxableIncome <= 700000 ? -newCalculatedTax : 0;

    const oldTaxAfterRebate = oldCalculatedTax + oldTaxRebate;
    // For the new regime, marginal relief is built into calculateNewRegimeTax.
    const newTaxAfterRebate = newCalculatedTax + newTaxRebate;

    // Calculate Health & Education Cess (4%) on the tax after rebate.
    const oldCess = oldTaxAfterRebate * 0.04;
    const newCess = newTaxAfterRebate * 0.04;

    const oldPayableTax = oldTaxAfterRebate + oldCess;
    const newPayableTax = newTaxAfterRebate + newCess;

    // Message indicating which regime is better.
    let message;
    if (oldPayableTax < newPayableTax) {
      message = "As per the calculation, Old Tax Regime is better for you.";
    } else if (oldPayableTax > newPayableTax) {
      message = "As per the calculation, New Tax Regime (post Budget 2025) is better for you.";
    } else {
      message = "As per the calculation, tax payable in both regimes is equal.";
    }

    // Set the summary state with all calculated details.
    setSummary({
      totalIncome: totalA,
      old: {
        standardDeduction: oldStandardDeduction,
        exemptions: exemptions,
        totalDeductions: totalC,
        taxableIncome: oldTaxableIncome,
        calculatedTax: oldCalculatedTax,
        taxRebate: oldTaxRebate,
        taxAfterRebate: oldTaxAfterRebate,
        cess: oldCess,
        payableTax: oldPayableTax,
      },
      new: {
        standardDeduction: newStandardDeduction,
        taxableIncome: newTaxableIncome,
        calculatedTax: newCalculatedTax,
        taxRebate: newTaxRebate,
        taxAfterRebate: newTaxAfterRebate,
        // Marginal relief is applied within calculateNewRegimeTax.
        cess: newCess,
        payableTax: newPayableTax,
      },
      message,
      applyStandardDeduction,
    });

    nextStep();
  };

  // PDF Download functionality.
  const downloadPdf = () => {
    const input = document.getElementById('report');
    const buttonGroups = input.querySelectorAll('.button-group');
    buttonGroups.forEach(group => {
      group.style.display = 'none';
    });
    
    const logoBase64 = './assets/taxallnewww.png';
  
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const logoX = 10;
      const logoY = 10;
      const logoWidth = 30;
      const logoHeight = 20;
      pdf.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
      
      pdf.save("income_tax_summary.pdf");
  
      buttonGroups.forEach(group => {
        group.style.display = '';
      });
    });
  };

  // Prepare chart data for the summary graphs.
  const barData = summary
    ? [
        { regime: 'Old Regime', payableTax: summary.old.payableTax },
        { regime: 'New Regime', payableTax: summary.new.payableTax },
      ]
    : [];

  let preferredRegime = null;
  if (summary) {
    preferredRegime = summary.old.payableTax <= summary.new.payableTax ? 'old' : 'new';
  }
  const pieData =
    summary && preferredRegime === 'old'
      ? [
          { name: 'Tax After Rebate', value: summary.old.taxAfterRebate },
          { name: 'Cess', value: summary.old.cess },
        ]
      : summary && preferredRegime === 'new'
      ? [
          { name: 'Tax After Rebate', value: summary.new.taxAfterRebate },
          { name: 'Cess', value: summary.new.cess },
        ]
      : [];
  const pieColors = ['#ff6b6b', '#feca57'];

  return (
    <div className="income-tax-calculator">
      {/* Step Indicator */}
      <div className="step-indicator">
        {steps.map((s) => (
          <div
            key={s.id}
            className={`step ${step === s.id ? 'active' : ''} ${s.id < step ? 'completed' : ''}`}
            onClick={() => { if (s.id <= step) setStep(s.id); }}
          >
            <div className="step-number">{s.id}</div>
            <div className="step-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Step 1: Basic Details */}
      {step === 1 && (
        <div className="basic-details section">
          <h2>Basic Details</h2>
          <div className="form-group">
            <label>Financial Year:</label>
            <select
              name="financialYear"
              value={basicDetails.financialYear}
              onChange={handleBasicChange}
            >
              <option value="">Select Financial Year</option>
              <option value="FY25-26">FY 25-26</option>
              <option value="FY24-25">FY 24-25</option>
            </select>
          </div>
          <div className="form-group">
            <label>Age Group:</label>
            <select
              name="ageGroup"
              value={basicDetails.ageGroup}
              onChange={handleBasicChange}
            >
              <option value="">Select Age Group</option>
              <option value="0-60">0-60</option>
              <option value="60-80">60-80</option>
              <option value="80-100">80-100</option>
            </select>
          </div>
          <div className="form-group">
            <label>Apply Standard Deduction?</label>
            <select
              name="applyStandardDeduction"
              value={basicDetails.applyStandardDeduction}
              onChange={handleBasicChange}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="button-group">
            <button className="btn" onClick={nextStep}>
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Income Details */}
      {step === 2 && (
        <div className="income-details section">
          <h2>Income Details</h2>
          <div className="grid-container">
            <div className="form-group">
              <label>Income from Salary:</label>
              <input
                type="number"
                name="salary"
                value={incomeDetails.salary}
                onChange={handleIncomeChange}
                placeholder="₹"
              />
            </div>
            <div className="form-group">
              <label>Rental Income:</label>
              <input
                type="number"
                name="rentalIncome"
                value={incomeDetails.rentalIncome}
                onChange={handleIncomeChange}
                placeholder="₹"
              />
            </div>
            <div className="form-group">
              <label>Income from Interest:</label>
              <input
                type="number"
                name="interest"
                value={incomeDetails.interest}
                onChange={handleIncomeChange}
                placeholder="₹"
              />
            </div>
            <div className="form-group">
              <label>Income from Other Sources:</label>
              <input
                type="number"
                name="otherIncome"
                value={incomeDetails.otherIncome}
                onChange={handleIncomeChange}
                placeholder="₹"
              />
            </div>
            <div className="form-group">
              <label>Exempt Allowances:</label>
              <input
                type="number"
                name="exemptAllowances"
                value={incomeDetails.exemptAllowances}
                onChange={handleIncomeChange}
                placeholder="₹"
              />
            </div>
            <div className="form-group">
              <label>Interest on Home Loan (Self Occupied):</label>
              <input
                type="number"
                name="interestHomeLoanSelf"
                value={incomeDetails.interestHomeLoanSelf}
                onChange={handleIncomeChange}
                placeholder="₹"
              />
            </div>
            <div className="form-group">
              <label>Interest on Home Loan (Let Out):</label>
              <input
                type="number"
                name="interestHomeLoanLetOut"
                value={incomeDetails.interestHomeLoanLetOut}
                onChange={handleIncomeChange}
                placeholder="₹"
              />
            </div>
          </div>
          <div className="button-group">
            <button className="btn back-btn" onClick={prevStep}>
              Back
            </button>
            <button className="btn" onClick={nextStep}>
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Deductions */}
      {step === 3 && (
        <div className="deductions section">
          <h2>Deductions</h2>
          <div className="grid-container">
            <div className="form-group">
              <label>Basic Deductions (80C):</label>
              <input
                type="number"
                name="basicDeduction80C"
                value={deductions.basicDeduction80C}
                onChange={handleDeductionChange}
                placeholder="₹"
              />
            </div>
            <div className="form-group">
              <label>Medical Insurance (80D):</label>
              <input
                type="number"
                name="medicalInsurance80D"
                value={deductions.medicalInsurance80D}
                onChange={handleDeductionChange}
                placeholder="₹"
              />
            </div>
            <div className="form-group">
              <label>Donations to Charity (80G):</label>
              <input
                type="number"
                name="donations80G"
                value={deductions.donations80G}
                onChange={handleDeductionChange}
                placeholder="₹"
              />
            </div>
            <div className="form-group">
              <label>Any Other Deduction:</label>
              <input
                type="number"
                name="otherDeduction"
                value={deductions.otherDeduction}
                onChange={handleDeductionChange}
                placeholder="₹"
              />
            </div>
          </div>
          <div className="button-group">
            <button className="btn back-btn" onClick={prevStep}>
              Back
            </button>
            <button className="btn" onClick={calculateTax}>
              Calculate
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Summary Report */}
      {step === 4 && summary && (
        <div id="report" className="summary section">
          <h2>Summary Report</h2>
          <h3>Financial Year: {basicDetails.financialYear}</h3>
          <div className="comparison-table">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Old Regime</th>
                  <th>New Regime (Post Budget 2025)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Taxable Income</td>
                  <td>{formatCurrency(summary.old.taxableIncome)}</td>
                  <td>{formatCurrency(summary.new.taxableIncome)}</td>
                </tr>
                <tr>
                  <td>Calculated Tax</td>
                  <td>{formatCurrency(summary.old.calculatedTax)}</td>
                  <td>{formatCurrency(summary.new.calculatedTax)}</td>
                </tr>
                <tr>
                  <td>Tax Rebate</td>
                  <td>{formatCurrency(summary.old.taxRebate)}</td>
                  <td>{formatCurrency(summary.new.taxRebate)}</td>
                </tr>
                <tr>
                  <td>Tax After Rebate</td>
                  <td>{formatCurrency(summary.old.taxAfterRebate)}</td>
                  <td>{formatCurrency(summary.new.taxAfterRebate)}</td>
                </tr>
                <tr>
                  <td>Health &amp; Education Cess (4%)</td>
                  <td>{formatCurrency(summary.old.cess)}</td>
                  <td>{formatCurrency(summary.new.cess)}</td>
                </tr>
                <tr>
                  <th>Payable Tax</th>
                  <th>{formatCurrency(summary.old.payableTax)}</th>
                  <th>{formatCurrency(summary.new.payableTax)}</th>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="charts-flex-container">
            <div className="bar-chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="regime" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="payableTax" fill={summary.old.payableTax <= summary.new.payableTax ? "#ff6b6b" : "#feca57"} animationDuration={1500}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "#ff6b6b" : "#feca57"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="pie-chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie dataKey="value" data={pieData} cx="50%" cy="50%" outerRadius={80} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p className="summary-message">{summary.message}</p>
          <div className="button-group">
            <button className="btn back-btn" onClick={prevStep}>
              Back
            </button>
            <button className="btn" onClick={downloadPdf}>
              Download Report as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeTaxCalculator;
