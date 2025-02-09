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
  // Step management: 1 = Basic Details, 2 = Income Details, 3 = Deductions, 4 = Summary
  const [step, setStep] = useState(1);

  // Basic Details: financial year, age group, and whether to apply standard deduction
  const [basicDetails, setBasicDetails] = useState({
    financialYear: '',
    ageGroup: '',
    applyStandardDeduction: 'yes',
  });

  // Income Details: salary, rental income, interest, other income, exempt allowances,
  // and home loan interests (self occupied and let out)
  const [incomeDetails, setIncomeDetails] = useState({
    salary: '',
    rentalIncome: '',
    interest: '',
    otherIncome: '',
    exemptAllowances: '',
    interestHomeLoanSelf: '',
    interestHomeLoanLetOut: '',
  });

  // Deductions: basic deductions (80C), medical insurance (80D), donations (80G), and other deductions
  const [deductions, setDeductions] = useState({
    basicDeduction80C: '',
    medicalInsurance80D: '',
    donations80G: '',
    otherDeduction: '',
  });

  // Summary state to store all calculated results
  const [summary, setSummary] = useState(null);

  // Helper function to format currency values
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

  // Navigation functions for the steps
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Input change handlers for each section
  const handleBasicChange = (e) => {
    setBasicDetails({ ...basicDetails, [e.target.name]: e.target.value });
  };

  const handleIncomeChange = (e) => {
    setIncomeDetails({ ...incomeDetails, [e.target.name]: e.target.value });
  };

  const handleDeductionChange = (e) => {
    setDeductions({ ...deductions, [e.target.name]: e.target.value });
  };

  // -----------------------------------
  // TAX CALCULATION FUNCTIONS
  // -----------------------------------

  // Old Tax Regime Slab Calculation
  function calculateOldRegimeTax(taxableIncome) {
    if (taxableIncome <= 250000) return 0;
    if (taxableIncome <= 500000) return (taxableIncome - 250000) * 0.05;
    if (taxableIncome <= 1000000)
      return (taxableIncome - 500000) * 0.2 + 12500;
    return (taxableIncome - 1000000) * 0.3 + 112500;
  }

  // New Tax Regime Slab Calculation
  function calculateNewRegimeTax(taxableIncome) {
    if (taxableIncome <= 300000) return 0;
    if (taxableIncome <= 700000) return (taxableIncome - 300000) * 0.05;
    if (taxableIncome <= 1000000)
      return (taxableIncome - 700000) * 0.1 + 20000;
    if (taxableIncome <= 1200000)
      return (taxableIncome - 1000000) * 0.15 + 50000;
    if (taxableIncome <= 1500000)
      return (taxableIncome - 1200000) * 0.2 + 80000;
    return (taxableIncome - 1500000) * 0.3 + 140000;
  }

  // Main tax calculation function
  const calculateTax = () => {
    // Total A: Sum of salary, rental income, interest, and other income
    const salary = Number(incomeDetails.salary || 0);
    const rental = Number(incomeDetails.rentalIncome || 0);
    const interest = Number(incomeDetails.interest || 0);
    const otherIncome = Number(incomeDetails.otherIncome || 0);
    const totalA = salary + rental + interest + otherIncome;

    // Total B: Exemptions (Exempt Allowances)
    const exemptions = Number(incomeDetails.exemptAllowances || 0);

    // Home Loan Interest: Sum of self occupied and let out
    const homeLoanInterest =
      Number(incomeDetails.interestHomeLoanSelf || 0) +
      Number(incomeDetails.interestHomeLoanLetOut || 0);

    // Total C: Sum of deductions from 80C, 80D, 80G, other deductions plus home loan interest
    const basicDeduction = Number(deductions.basicDeduction80C || 0);
    const medicalInsurance = Number(deductions.medicalInsurance80D || 0);
    const donations = Number(deductions.donations80G || 0);
    const otherDeduction = Number(deductions.otherDeduction || 0);
    const totalC =
      basicDeduction + medicalInsurance + donations + homeLoanInterest + otherDeduction;

    // Standard Deduction based on user selection
    const applyStandardDeduction = basicDetails.applyStandardDeduction === 'yes';
    const oldStandardDeduction = applyStandardDeduction ? 50000 : 0;
    const newStandardDeduction = applyStandardDeduction ? 75000 : 0;

    // Tax rebate thresholds for each regime
    const oldTaxRebateUpto = 500000;
    const newTaxRebateUpto = 700000;

    // Taxable Income Calculation:
    const oldTaxableIncome = Math.max(
      totalA - oldStandardDeduction - exemptions - totalC,
      0
    );
    const newTaxableIncome = Math.max(totalA - newStandardDeduction, 0);

    // Calculated Tax using the slab functions:
    const oldCalculatedTax = calculateOldRegimeTax(oldTaxableIncome);
    const newCalculatedTax = calculateNewRegimeTax(newTaxableIncome);

    // Apply full tax rebate if taxable income is below the threshold:
    const oldTaxRebate =
      oldTaxableIncome <= oldTaxRebateUpto ? -oldCalculatedTax : 0;
    const newTaxRebate =
      newTaxableIncome <= newTaxRebateUpto ? -newCalculatedTax : 0;

    // Tax After Rebate:
    const oldTaxAfterRebate = oldCalculatedTax + oldTaxRebate;
    const newTaxAfterRebate = newCalculatedTax + newTaxRebate;

    // Marginal Relief for New Regime:
    const excessIncome =
      newTaxableIncome > newTaxRebateUpto ? newTaxableIncome - newTaxRebateUpto : 0;
    const newTaxAfterMarginalRelief = Math.min(excessIncome, newTaxAfterRebate);

    // Health & Education Cess (4%):
    const oldCess = oldTaxAfterRebate * 0.04;
    const newCess = newTaxAfterMarginalRelief * 0.04;

    // Final Payable Tax:
    const oldPayableTax = oldTaxAfterRebate + oldCess;
    const newPayableTax = newTaxAfterMarginalRelief + newCess;

    // Decide which regime is better:
    let message;
    if (oldPayableTax < newPayableTax) {
      message = "As per the calculation, Old Tax Regime is better for you.";
    } else if (oldPayableTax > newPayableTax) {
      message = "As per the calculation, New Tax Regime is better for you.";
    } else {
      message = "As per the calculation, tax payable in both regimes is equal.";
    }

    // Set the summary state with all calculated values
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
        taxAfterMarginalRelief: newTaxAfterMarginalRelief,
        cess: newCess,
        payableTax: newPayableTax,
      },
      message,
      applyStandardDeduction,
    });

    nextStep();
  };

  // PDF download functionality using html2canvas and jsPDF
  const downloadPdf = () => {
    const input = document.getElementById('report');
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      // Add a logo if desired (replace with your Base64 encoded logo)
      const logoData = "data:image/png;base64,PUT_YOUR_BASE64_LOGO_HERE";
      pdf.addImage(logoData, 'PNG', 10, 10, 30, 30);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const yOffset = 45; // Leave space for the logo
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, yOffset, pdfWidth, pdfHeight);
      pdf.save("income_tax_summary.pdf");
    });
  };

  // Prepare chart data for the summary page graphs
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
          { name: 'Tax After Marginal Relief', value: summary.new.taxAfterMarginalRelief },
          { name: 'Cess', value: summary.new.cess },
        ]
      : [];
  const pieColors = ['#007bff', '#28a745'];

  return (
    <div className="income-tax-calculator">
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

      {/* Step 4: Summary Report with Graphs */}
      {step === 4 && summary && (
        <div id="report" className="summary section">
          <h2>Summary Report</h2>
          {/* Display the selected Financial Year */}
          <h3>Financial Year: {basicDetails.financialYear}</h3>

          {/* Comparison Table */}
          <div className="comparison-table">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Old Regime</th>
                  <th>New Regime</th>
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
                  <td>Tax After Marginal Relief</td>
                  <td>N/A</td>
                  <td>{formatCurrency(summary.new.taxAfterMarginalRelief)}</td>
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

          {/* Graphs */}
          <div className="charts-flex-container">
            <div className="bar-chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="regime" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar
                    dataKey="payableTax"
                    fill={
                      summary.old.payableTax <= summary.new.payableTax ? "#007bff" : "#28a745"
                    }
                    animationDuration={1500}
                  >
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "#007bff" : "#28a745"} />
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
