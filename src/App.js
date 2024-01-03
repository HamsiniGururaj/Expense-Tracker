import React, {useState, useEffect, useRef} from 'react';
import './App.css';
import jspdf from 'jspdf';


const App = () =>
{
  const [expense, setExpense] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [error, setError] = useState('');
  const addTransactionFormRef = useRef(null);
  const setBudgetFormRef = useRef(null);
  const [sortOrder, setSortOrder] = useState('asc');


  useEffect(() =>
  {
    const calculateTotalExpense = () => 
    {
      const total = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
      setTotalExpense(total);
    };

    calculateTotalExpense();

    if (monthlyBudget > 0 && totalExpense > monthlyBudget) 
    {
      setError('Warning: You have exceeded your monthly budget!');
    } else 
    {
      setError('');
    }
  },
  [transactions, monthlyBudget, totalExpense]);

  const handleRemoveWarning = () => 
  {
    setError('');
  };

  const handleAddTransaction = (e) =>
   {
    e.preventDefault();
    setError('');

    const type = e.target.type.value;
    const date = e.target.date.value;
    const category = e.target.category.value;
    const amount = parseFloat(e.target.amount.value);
    const comment = e.target.comment.value;
   
    if (amount <= 0) 
    {
      setError('Please enter a valid positive number.');
      return;
    }

    const newTransaction =
    {
      type,
      date,
      category,
      amount,
      comment,
    };

    setTransactions([...transactions, newTransaction]);
    setExpense(expense + amount);

    addTransactionFormRef.current.reset();
  };

  const handleSetBudget = (e) =>
  {
    e.preventDefault();
    setError('');

    const budget = parseFloat(e.target[0].value);

    if (budget <= 0)
    {
      setError('Invalid budget.Please enter a valid positive number.');
      return;
    }

    setMonthlyBudget(budget);

    setBudgetFormRef.current.reset();
  };

  const handleRemoveTransaction = (index) =>
   {
    const updatedTransactions = [...transactions];
    const removedAmount = updatedTransactions.splice(index, 1)[0].amount;
    setTransactions(updatedTransactions);
    setExpense((prevExpense) => prevExpense - removedAmount);
  };

  const handleSortOrderChange = () => 
  {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  useEffect(() => 
  {
    const sortedTransactions = transactions.slice().sort((a, b) =>
     {
      if (sortOrder === 'asc') 
      {
        return new Date(a.date) - new Date(b.date);
      } else
      {
        return new Date(b.date) - new Date(a.date);
      }
    });

    setTransactions(sortedTransactions);
  }, [sortOrder, transactions]);


  const handleDownloadSummary = () =>
  {
    const pdf = new jspdf();

    pdf.text('Transaction History:', 20, 40);

    transactions.forEach((transaction, index) =>
    {
      const yPos = 50 + index * 10;
      pdf.text(`${transaction.date}  ${transaction.type}  ${transaction.category}  ₹${transaction.amount.toFixed(2)}`, 20, yPos);
    }
    );

    pdf.text(`Total Expense: ₹${totalExpense.toFixed(2)}`, 20, 20);
    pdf.text(`Monthly Budget: ₹${monthlyBudget.toFixed(2)}`, 20, 30);

    pdf.save('expense_summary.pdf');
    
  };

  return(
    <div>
      <header>
       <div id="head">
         <div id="mw">MY WALLET</div>
         <div id="logo"></div>
       </div>
     </header>
     <section id="s1">
      <div id="exp">
        <div className="t1">EXPENSE</div>
        <div className="t2">
          <p id="ex">₹{expense.toFixed(2)}</p>
        </div>
      </div>
      {error && (
          <div id="warn" style={{ color: 'red', marginTop: '10px' }}>
            {error}
            <button id="remwarn" onClick={handleRemoveWarning}>X</button>
          </div>
        )}
    </section>
    <form id="addt" onSubmit={handleAddTransaction} ref={addTransactionFormRef}>
        <div id="head2">Add a new transaction</div>
        <div id="addts">
          <label htmlFor="type">Type</label>
          <select id="type" required>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="onetime">One time</option>
          </select>
          <br />
          <label htmlFor="date">Date</label>
          <input type="date" id="date" required />
          <br />
          <label htmlFor="category">Category</label>
          <select id="category" required>
            <option value="education">Education</option>
            <option value="food">Food</option>
            <option value="rent">Rent</option>
            <option value="transportation">Transportation</option>
            <option value="health">Health</option>
            <option value="clothing">Clothing</option>
            <option value="social">Social</option>
            <option value="entertainment">Entertainment</option>
            <option value="misc">Miscellaneous</option>
          </select>
          <br />
          <label htmlFor="amount">Amount in ₹</label>
          <input type="number" name="amount" required />
          <br />
          <label htmlFor="comment">Comments</label>
          <input type="text" name="comment" />
          <br />
          <button id="add" type="submit">
            ADD
          </button>
        </div>
      </form>
      <form id="budget" onSubmit={handleSetBudget} ref={setBudgetFormRef}>
        <div id="setb">
          <label htmlFor="setb" id="setbt">Set a monthly budget</label>
          <input type="number" name="monthlyBudget" id="mb" />
          <button id="set" type="submit">
            SET
          </button>
        </div>
      </form>
      <section id="s2">
        <div id="history">
          <p id="t3">Transaction History{' '}
            <button id="sort"
              onClick={handleSortOrderChange}
            >
              Sort: {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </p>
          <ul id="thistory">
            {transactions.map((transaction, index) => 
            (
              <li key={index}>
                {transaction.date}  -  {transaction.type}  -  {transaction.category}  -  ₹{transaction.amount.toFixed(2)}
                <button id="rem" onClick={() => handleRemoveTransaction(index)}>Remove</button>
              </li>
              
            ))}
          </ul>
        </div>
        <div id="dload">
          <p id="dlt">
            Download summary pdf
          </p>
          <button id="dl" onClick={handleDownloadSummary}>DOWNLOAD</button>
        </div>
      </section>
    </div>
  );
};


export default App;
