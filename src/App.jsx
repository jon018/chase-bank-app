import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'flashremit-bank-data';

const makeReferenceId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = 'FR-';
  for (let i = 0; i < 8; i += 1) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return ref;
};

const createAccountNumber = () => {
  const random = Math.floor(1000000000 + Math.random() * 9000000000);
  return random.toString();
};

const seedData = () => {
  const admin = {
    id: 'admin-1',
    firstName: 'System',
    lastName: 'Admin',
    email: 'admin@flashremit.com',
    password: 'admin123',
    role: 'admin',
    balance: 130000000,
    currency: 'USD',
    accountNumber: '1000000001',
    theme: 'dark',
    support: [],
    transactions: [
      {
        id: 'txn-admin-1',
        type: 'initial',
        amount: 130000000,
        date: new Date().toISOString(),
        status: 'Successful',
        sender: 'FlashRemit Treasury',
        recipient: 'System Admin',
        reference: makeReferenceId(),
      },
    ],
  };

  return {
    accounts: [admin],
    authUserId: null,
    supportMessages: [
      {
        id: 'sup-1',
        userId: 'admin-1',
        sender: 'Admin',
        message: 'Welcome to FlashRemit support.',
        time: new Date().toISOString(),
        isAdmin: true,
      },
    ],
    transactions: [
      {
        id: 'txn-admin-1',
        type: 'initial',
        amount: 130000000,
        date: new Date().toISOString(),
        status: 'Successful',
        sender: 'FlashRemit Treasury',
        recipient: 'System Admin',
        reference: makeReferenceId(),
        accountId: 'admin-1',
      },
    ],
    withdrawalRequests: [],
  };
};

const getInitialState = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = seedData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    return JSON.parse(raw);
  } catch {
    const initial = seedData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
};

function App() {
  const [data, setData] = useState(() => getInitialState());
  const [authMode, setAuthMode] = useState('login');
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [withdrawForm, setWithdrawForm] = useState({
    method: 'bank',
    bankName: '',
    swift: '',
    accountHolderName: '',
    accountNumber: '',
    amount: '0.00',
  });
  const [screen, setScreen] = useState('auth');
  const [supportText, setSupportText] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [transferRecipient, setTransferRecipient] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  const currentUser = useMemo(() => {
    return data.accounts.find((acc) => acc.id === data.authUserId) || null;
  }, [data]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateAccountBalances = (accountId, newBalance) => {
    setData((prev) => ({
      ...prev,
      accounts: prev.accounts.map((acc) =>
        acc.id === accountId ? { ...acc, balance: Number(newBalance) } : acc
      ),
    }));
  };

  const handleSignup = (event) => {
    event.preventDefault();
    const { firstName, lastName, email, password } = formValues;
    if (!firstName || !lastName || !email || !password) return;

    const existing = data.accounts.find((acc) => acc.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      alert('An account with that email already exists.');
      return;
    }

    const newAccount = {
      id: `user-${Date.now()}`,
      firstName,
      lastName,
      email,
      password,
      role: 'user',
      balance: 0,
      currency: 'USD',
      accountNumber: createAccountNumber(),
      theme: 'light',
      support: [],
      transactions: [],
    };

    setData((prev) => ({
      ...prev,
      accounts: [...prev.accounts, newAccount],
      authUserId: newAccount.id,
    }));

    setScreen('dashboard');
    setActiveTab('overview');
    setFormValues({ firstName: '', lastName: '', email: '', password: '' });
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const account = data.accounts.find(
      (acc) => acc.email.toLowerCase() === formValues.email.toLowerCase() && acc.password === formValues.password
    );

    if (!account) {
      alert('Incorrect email or password');
      return;
    }

    setData((prev) => ({ ...prev, authUserId: account.id }));
    setScreen('dashboard');
    setFormValues({ firstName: '', lastName: '', email: '', password: '' });
  };

  const handleWithdrawSubmit = (event) => {
    event.preventDefault();
    if (!currentUser) return;
    const amount = Number(withdrawForm.amount);
    if (!withdrawForm.bankName || !withdrawForm.swift || !withdrawForm.accountHolderName || !withdrawForm.accountNumber || !amount || amount <= 0) {
      alert('Please complete the withdrawal details.');
      return;
    }

    if (amount > currentUser.balance) {
      alert('Withdrawal amount exceeds available balance.');
      return;
    }

    const request = {
      id: `wd-${Date.now()}`,
      userId: currentUser.id,
      amount,
      bankName: withdrawForm.bankName,
      swift: withdrawForm.swift,
      accountHolderName: withdrawForm.accountHolderName,
      accountNumber: withdrawForm.accountNumber,
      status: 'Pending',
      reference: makeReferenceId(),
      createdAt: new Date().toISOString(),
    };

    setData((prev) => ({
      ...prev,
      withdrawalRequests: [request, ...prev.withdrawalRequests],
    }));

    setScreen('token');
  };

  const handleApproveWithdrawal = (id) => {
    setData((prev) => ({
      ...prev,
      withdrawalRequests: prev.withdrawalRequests.map((request) =>
        request.id === id ? { ...request, status: 'Successful' } : request
      ),
    }));

    const request = data.withdrawalRequests.find((item) => item.id === id);
    if (request) {
      const user = data.accounts.find((acc) => acc.id === request.userId);
      if (user) {
        const newBalance = user.balance - request.amount;
        updateAccountBalances(user.id, newBalance);
      }
    }
  };

  const handleTransfer = (event) => {
    event.preventDefault();
    if (!currentUser) return;
    const recipient = data.accounts.find((acc) => acc.accountNumber === transferRecipient || acc.email.toLowerCase() === transferRecipient.toLowerCase());
    const amount = Number(transferAmount);

    if (!recipient || recipient.id === currentUser.id) {
      alert('Please select a valid recipient account.');
      return;
    }

    if (amount <= 0 || amount > currentUser.balance) {
      alert('Invalid transfer amount.');
      return;
    }

    const senderBalance = currentUser.balance - amount;
    const recipientBalance = recipient.balance + amount;

    const transferRecord = {
      id: `tr-${Date.now()}`,
      amount,
      type: 'Transfer',
      status: 'Successful',
      date: new Date().toISOString(),
      sender: `${currentUser.firstName} ${currentUser.lastName}`,
      recipient: `${recipient.firstName} ${recipient.lastName}`,
      reference: makeReferenceId(),
      accountId: currentUser.id,
    };

    const recipRecord = {
      ...transferRecord,
      sender: `${currentUser.firstName} ${currentUser.lastName}`,
      recipient: `${recipient.firstName} ${recipient.lastName}`,
      accountId: recipient.id,
    };

    setData((prev) => ({
      ...prev,
      accounts: prev.accounts.map((acc) => {
        if (acc.id === currentUser.id) return { ...acc, balance: senderBalance };
        if (acc.id === recipient.id) return { ...acc, balance: recipientBalance };
        return acc;
      }),
      transactions: [
        transferRecord,
        ...prev.transactions,
        recipRecord,
      ],
    }));

    setTransferRecipient('');
    setTransferAmount('');
    alert('Transfer completed successfully.');
  };

  const handleSupportSend = () => {
    if (!supportText.trim() || !currentUser) return;
    const message = {
      id: `msg-${Date.now()}`,
      sender: `${currentUser.firstName} ${currentUser.lastName}`,
      message: supportText,
      time: new Date().toISOString(),
      isAdmin: false,
      userId: currentUser.id,
    };

    setData((prev) => ({
      ...prev,
      supportMessages: [...prev.supportMessages, message],
    }));

    setSupportText('');
    setTimeout(() => {
      setData((prev) => ({
        ...prev,
        supportMessages: [
          ...prev.supportMessages,
          {
            id: `msg-admin-${Date.now()}`,
            sender: 'Admin',
            message: 'Thank you for contacting support. We will follow up shortly.',
            time: new Date().toISOString(),
            isAdmin: true,
            userId: currentUser.id,
          },
        ],
      }));
    }, 600);
  };

  const renderAuthView = () => (
    <div className="auth-shell">
      <div className="brand-block">
        <div className="brand-mark">
          <span className="brand-mark__bar brand-mark__bar--1" />
          <span className="brand-mark__bar brand-mark__bar--2" />
          <span className="brand-mark__bar brand-mark__bar--3" />
        </div>
        <div className="brand-name">FlashRemit</div>
        <div className="brand-tag">Send • Receive • Transfer</div>
      </div>

      <div className="auth-card">
        <div className="auth-toggle">
          <button className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>
            Sign In
          </button>
          <button className={authMode === 'signup' ? 'active' : ''} onClick={() => setAuthMode('signup')}>
            Sign Up
          </button>
        </div>

        {authMode === 'signup' ? (
          <form onSubmit={handleSignup} className="auth-form">
            <div className="field-row double">
              <input
                placeholder="First name"
                value={formValues.firstName}
                onChange={(e) => setFormValues({ ...formValues, firstName: e.target.value })}
              />
              <input
                placeholder="Last name"
                value={formValues.lastName}
                onChange={(e) => setFormValues({ ...formValues, lastName: e.target.value })}
              />
            </div>
            <input
              placeholder="Email"
              type="email"
              value={formValues.email}
              onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
            />
            <input
              placeholder="Password"
              type="password"
              value={formValues.password}
              onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
            />
            <button type="submit" className="primary-btn">Create Account</button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="auth-form">
            <input
              placeholder="Email"
              type="email"
              value={formValues.email}
              onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
            />
            <input
              placeholder="Password"
              type="password"
              value={formValues.password}
              onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
            />
            <button type="submit" className="primary-btn">Sign In</button>
          </form>
        )}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="app-shell">
      <header className="topbar">
        <button className="menu-btn" aria-label="Menu">☰</button>
        <div className="mini-logo">
          <span className="mini-logo__mark">F</span>
          <span>FlashRemit</span>
        </div>
      </header>

      <main className="content-wrap dashboard-layout">
        <div className="overview-panel">
          <div className="account-summary card-box">
            <div>
              <p className="tiny-label">Available balance</p>
              <h2>{`$${currentUser.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</h2>
            </div>
            <div className="account-chip">{currentUser.accountNumber}</div>
          </div>

          <div className="quick-grid">
            <div className="card-box transfer-box">
              <h3>Send money</h3>
              <form onSubmit={handleTransfer} className="transfer-form">
                <input
                  value={transferRecipient}
                  onChange={(e) => setTransferRecipient(e.target.value)}
                  placeholder="Recipient email or account number"
                />
                <input
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="Amount"
                  type="number"
                  min="0"
                  step="0.01"
                />
                <button type="submit" className="primary-btn small-btn">Transfer</button>
              </form>
            </div>
            <div className="card-box">
              <h3>Recent activity</h3>
              <ul className="activity-list">
                {data.transactions.slice(0, 4).map((item) => (
                  <li key={item.id}>
                    <span>{item.type}</span>
                    <strong>{item.status}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <aside className="side-panel">
          <div className="card-box settings-box">
            <h3>Settings</h3>
            <div className="settings-list">
              <button onClick={() => setScreen('withdraw')}>Withdrawal</button>
              <button onClick={() => setScreen('support')}>Customer Support</button>
              <button onClick={() => setScreen('auth')}>Logout</button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );

  const renderWithdrawScreen = () => (
    <div className="app-shell">
      <header className="topbar">
        <button className="menu-btn" aria-label="Menu">☰</button>
        <div className="mini-logo">
          <span className="mini-logo__mark">F</span>
          <span>FlashRemit</span>
        </div>
      </header>

      <main className="content-wrap withdraw-wrap">
        <h1 className="page-title">Withdraw</h1>
        <p className="page-subtitle">Withdraw funds to a bank account or card.</p>

        <div className="toggle-box">
          <button
            className={withdrawForm.method === 'bank' ? 'method selected' : 'method'}
            onClick={() => setWithdrawForm({ ...withdrawForm, method: 'bank' })}
          >
            🏦 Add Bank
          </button>
          <button
            className={withdrawForm.method === 'card' ? 'method selected' : 'method'}
            onClick={() => setWithdrawForm({ ...withdrawForm, method: 'card' })}
          >
            💳 Choose Card
          </button>
        </div>

        <form onSubmit={handleWithdrawSubmit} className="withdraw-form">
          <div className="field-row">
            <label>
              <span>Bank Name</span>
              <input
                value={withdrawForm.bankName}
                onChange={(e) => setWithdrawForm({ ...withdrawForm, bankName: e.target.value })}
              />
            </label>
            <label>
              <span>SWIFT/BIC</span>
              <input
                value={withdrawForm.swift}
                onChange={(e) => setWithdrawForm({ ...withdrawForm, swift: e.target.value })}
              />
            </label>
          </div>

          <label className="full-width">
            <span>Account Holder Name</span>
            <input
              value={withdrawForm.accountHolderName}
              onChange={(e) => setWithdrawForm({ ...withdrawForm, accountHolderName: e.target.value })}
            />
          </label>

          <div className="field-row">
            <label>
              <span>Account Number</span>
              <input
                value={withdrawForm.accountNumber}
                onChange={(e) => setWithdrawForm({ ...withdrawForm, accountNumber: e.target.value })}
              />
            </label>
            <label>
              <span>Amount</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={withdrawForm.amount}
                onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
              />
            </label>
          </div>

          <button type="submit" className="continue-btn">
            <span>↓</span>
            Continue
          </button>
        </form>
      </main>
    </div>
  );

  const renderTokenPage = () => (
    <div className="app-shell">
      <header className="topbar">
        <button className="menu-btn" aria-label="Menu">☰</button>
        <div className="mini-logo">
          <span className="mini-logo__mark">F</span>
          <span>FlashRemit</span>
        </div>
      </header>

      <main className="content-wrap token-wrap">
        <h1 className="page-title token-title">Withdrawal Token Required</h1>

        <div className="token-alert">
          <div className="alert-icon">!</div>
          <div>
            <h2>WITHDRAWAL TOKEN REQUIRED</h2>
            <p>A withdrawal token is required to complete your withdrawal.</p>
          </div>
        </div>

        <div className="asset-list">
          <h3>Available Withdrawal Assets</h3>
          <ul>
            <li>• USDT</li>
            <li>• SOL</li>
            <li>• E-code</li>
          </ul>
        </div>

        <p className="support-copy">
          Please contact FlashRemit Support for information on obtaining your withdrawal token and completing the withdrawal process.
        </p>
        <p className="support-copy">
          Once your token has been verified, you can proceed with your withdrawal.
        </p>

        <button className="support-btn">✉ Contact FlashRemit Support</button>

        <div className="summary-row">
          <span>Withdrawal Amount</span>
          <strong>€3090,20</strong>
        </div>
        <div className="summary-row">
          <span>Reference ID</span>
          <strong>FR-ATW69QQA</strong>
        </div>
        <div className="summary-row">
          <span>Withdrawal Status</span>
          <strong>Pending</strong>
        </div>
      </main>
    </div>
  );

  const renderSupportScreen = () => (
    <div className="app-shell">
      <header className="topbar">
        <button className="menu-btn" aria-label="Menu">☰</button>
        <div className="mini-logo">
          <span className="mini-logo__mark">F</span>
          <span>FlashRemit</span>
        </div>
      </header>

      <main className="content-wrap support-wrap">
        <h1 className="page-title">Customer Support</h1>
        <div className="support-panel">
          <div className="support-messages">
            {data.supportMessages.map((msg) => (
              <div key={msg.id} className={msg.isAdmin ? 'message admin' : 'message user'}>
                <strong>{msg.sender}</strong>
                <p>{msg.message}</p>
              </div>
            ))}
          </div>

          <div className="support-composer">
            <textarea
              value={supportText}
              onChange={(e) => setSupportText(e.target.value)}
              placeholder="Write a message to support..."
            />
            <button onClick={handleSupportSend} className="primary-btn">Send</button>
          </div>
        </div>
      </main>
    </div>
  );

  if (!currentUser && screen !== 'auth') {
    setScreen('auth');
  }

  if (screen === 'auth') return renderAuthView();
  if (screen === 'dashboard') return renderDashboard();
  if (screen === 'withdraw') return renderWithdrawScreen();
  if (screen === 'token') return renderTokenPage();
  if (screen === 'support') return renderSupportScreen();

  return renderDashboard();
}

export default App;
