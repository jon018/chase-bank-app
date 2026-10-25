const seedData = {
  users: [
    {
      id: 'admin-user',
      name: 'Admin User',
      email: 'admin@flashremit.com',
      password: 'admin123',
      role: 'admin',
      photo: '',
      theme: 'light',
      faceIdEnabled: true,
      phone: '+1 (555) 013-8942'
    }
  ],
  accounts: [
    {
      id: 'acc-admin',
      userId: 'admin-user',
      accountType: 'Primary Account',
      nickname: 'Primary Account',
      balance: 130000000,
      accountNumber: 'FR-1000001',
      currency: 'USD',
      status: 'active'
    }
  ],
  transactions: [
    {
      id: 'txn-admin-open',
      accountId: 'acc-admin',
      userId: 'admin-user',
      type: 'opening',
      title: 'Opening Balance',
      amount: 130000000,
      status: 'Successful',
      direction: 'credit',
      counterparty: 'FlashRemit Treasury',
      reference: 'REF-1001',
      createdAt: new Date().toISOString(),
      receipt: {
        amount: '130000000.00',
        date: new Date().toLocaleString(),
        txId: 'TXN-ADMIN-1001',
        reference: 'REF-1001',
        sender: 'FlashRemit Treasury',
        recipient: 'Admin User',
        status: 'Successful'
      }
    }
  ],
  supportMessages: [
    {
      id: 'support-welcome',
      userId: 'admin-user',
      sender: 'admin',
      text: 'Welcome to FlashRemit support. How can we help you today?',
      createdAt: new Date().toISOString()
    }
  ],
  recipients: [
    { id: 'rec-1', name: 'Chase Bank', logo: '🏦', type: 'Bank' },
    { id: 'rec-2', name: 'Bank of America', logo: '🏛️', type: 'Bank' },
    { id: 'rec-3', name: 'Citibank', logo: '💼', type: 'Bank' },
    { id: 'rec-4', name: 'Wells Fargo', logo: '🏢', type: 'Bank' }
  ]
};

const defaultImage = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(Number(value || 0));

const formatMoneyShort = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2
  }).format(Number(value || 0));

const generateAccountNumber = () => {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `FR-${random}`;
};

const getInitialData = () => {
  try {
    const saved = localStorage.getItem('flashremit-data');
    if (!saved) {
      localStorage.setItem('flashremit-data', JSON.stringify(seedData));
      return seedData;
    }
    return JSON.parse(saved);
  } catch (error) {
    return seedData;
  }
};

export default function App() {
  const [data, setData] = useState(getInitialData);
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('flashremit-session') || 'null');
    } catch {
      return null;
    }
  });
  const [view, setView] = useState('auth');
  const [authMode, setAuthMode] = useState('signin');
  const [toast, setToast] = useState('');
  const [withdrawalForm, setWithdrawalForm] = useState({
    bankName: '',
    swift: '',
    accountHolder: '',
    accountNumber: '',
    amount: '0.00',
    type: 'bank'
  });
  const [transferForm, setTransferForm] = useState({
    recipientId: '',
    amount: '0.00',
    memo: 'Transfer'
  });
  const [supportDraft, setSupportDraft] = useState('');
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [signinForm, setSigninForm] = useState({
    email: 'admin@flashremit.com',
    password: 'admin123'
  });

  useEffect(() => {
    localStorage.setItem('flashremit-data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (session) {
      localStorage.setItem('flashremit-session', JSON.stringify(session));
    } else {
      localStorage.removeItem('flashremit-session');
    }
  }, [session]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const user = data.users.find((entry) => entry.id === session?.userId) || null;
  const primaryAccount = data.accounts.find((account) => account.userId === user?.id && account.accountType === 'Primary Account') || data.accounts[0];
  const accountList = data.accounts.filter((account) => account.userId === user?.id);
  const pendingWithdrawals = data.transactions.filter(
    (transaction) => transaction.type === 'withdrawal' && transaction.status === 'Pending'
  );

  const updateToast = (message) => setToast(message);

  const handleSignup = (event) => {
    event.preventDefault();
    const { name, email, password, phone } = signupForm;
    if (!name || !email || !password) return;

    const duplicate = data.users.some((entry) => entry.email.toLowerCase() === email.toLowerCase());
    if (duplicate) {
      updateToast('An account already exists with that email.');
      return;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      phone: phone || '+1 (555) 010-2040',
      role: 'user',
      photo: defaultImage,
      theme: 'light',
      faceIdEnabled: false
    };

    const newAccount = {
      id: `acc-${Date.now()}`,
      userId: newUser.id,
      accountType: 'Primary Account',
      nickname: 'Primary Account',
      balance: 0,
      accountNumber: generateAccountNumber(),
      currency: 'USD',
      status: 'active'
    };

    const welcomeTransaction = {
      id: `txn-${Date.now()}`,
      accountId: newAccount.id,
      userId: newUser.id,
      type: 'opening',
      title: 'Welcome Deposit',
      amount: 0,
      status: 'Successful',
      direction: 'credit',
      counterparty: 'FlashRemit',
      reference: `REF-${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      receipt: {
        amount: '0.00',
        date: new Date().toLocaleString(),
        txId: `TXN-${Date.now()}`,
        reference: `REF-${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
        sender: 'FlashRemit',
        recipient: newUser.name,
        status: 'Successful'
      }
    };

    setData((previous) => ({
      ...previous,
      users: [...previous.users, newUser],
      accounts: [...previous.accounts, newAccount],
      transactions: [...previous.transactions, welcomeTransaction]
    }));

    setSession({ userId: newUser.id });
    setView('dashboard');
    setSignupForm({ name: '', email: '', password: '', phone: '' });
    updateToast('Account created successfully.');
  };

  const handleSignin = (event) => {
    event.preventDefault();
    const match = data.users.find(
      (entry) =>
        entry.email.toLowerCase() === signinForm.email.toLowerCase() &&
        entry.password === signinForm.password
    );

    if (!match) {
      updateToast('Invalid email or password.');
      return;
    }

    setSession({ userId: match.id });
    setView('dashboard');
    updateToast(`Welcome back, ${match.name.split(' ')[0]}.`);
  };

  const handleLogout = () => {
    setSession(null);
    setView('auth');
    setAuthMode('signin');
  };

  const handleTransfer = (event) => {
    event.preventDefault();
    const amountNumber = Number(transferForm.amount);
    if (!transferForm.recipientId || !amountNumber || amountNumber <= 0) {
      updateToast('Choose a recipient and a valid amount.');
      return;
    }

    const senderAccount = primaryAccount;
    const recipient = data.recipients.find((entry) => entry.id === transferForm.recipientId);
    if (!senderAccount || senderAccount.balance < amountNumber) {
      updateToast('Insufficient balance for this transfer.');
      return;
    }

    const reference = `REF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const transaction = {
      id: `txn-${Date.now()}`,
      accountId: senderAccount.id,
      userId: user.id,
      type: 'transfer',
      title: `Transfer to ${recipient?.name || 'recipient'}`,
      amount: amountNumber,
      status: 'Successful',
      direction: 'debit',
      counterparty: recipient?.name || 'Recipient',
      reference,
      createdAt: new Date().toISOString(),
      receipt: {
        amount: amountNumber.toFixed(2),
        date: new Date().toLocaleString(),
        txId: `TXN-${Date.now()}`,
        reference,
        sender: user.name,
        recipient: recipient?.name || 'Recipient',
        status: 'Successful'
      }
    };

    setData((previous) => ({
      ...previous,
      accounts: previous.accounts.map((account) => {
        if (account.id === senderAccount.id) {
          return { ...account, balance: Number(account.balance) - amountNumber };
        }
        return account;
      }),
      transactions: [transaction, ...previous.transactions]
    }));

    setTransferForm({ recipientId: '', amount: '0.00', memo: 'Transfer' });
    updateToast('Transfer completed successfully.');
  };

  const handleWithdrawalSubmit = (event) => {
    event.preventDefault();
    const amountNumber = Number(withdrawalForm.amount);
    if (!withdrawalForm.bankName || !withdrawalForm.accountHolder || !withdrawalForm.accountNumber || !amountNumber || amountNumber <= 0) {
      updateToast('Please complete all withdrawal fields.');
      return;
    }

    const senderAccount = primaryAccount;
    if (!senderAccount || senderAccount.balance < amountNumber) {
      updateToast('Your account balance is too low for this withdrawal.');
      return;
    }

    const reference = `FR-${Math.random().toString(36).slice(2, 9).toUpperCase()}`;
    const withdrawalItem = {
      id: `wd-${Date.now()}`,
      accountId: senderAccount.id,
      userId: user.id,
      type: 'withdrawal',
      title: `Withdrawal to ${withdrawalForm.bankName}`,
      amount: amountNumber,
      status: 'Pending',
      direction: 'debit',
      counterparty: withdrawalForm.bankName,
      reference,
      createdAt: new Date().toISOString(),
      receipt: {
        amount: amountNumber.toFixed(2),
        date: new Date().toLocaleString(),
        txId: `TXN-${Date.now()}`,
        reference,
        sender: user.name,
        recipient: withdrawalForm.bankName,
        status: 'Pending'
      }
    };

    setData((previous) => ({
      ...previous,
      transactions: [withdrawalItem, ...previous.transactions]
    }));

    setView('withdrawal-token');
    setWithdrawalForm({
      bankName: '',
      swift: '',
      accountHolder: '',
      accountNumber: '',
      amount: '0.00',
      type: 'bank'
    });
    updateToast('Withdrawal submitted. Waiting for approval.');
  };

  const handleSupportMessage = (event) => {
    event.preventDefault();
    if (!supportDraft.trim()) return;

    const message = {
      id: `msg-${Date.now()}`,
      userId: user.id,
      sender: 'user',
      text: supportDraft.trim(),
      createdAt: new Date().toISOString()
    };

    setData((previous) => ({
      ...previous,
      supportMessages: [...previous.supportMessages, message]
    }));
    setSupportDraft('');
    updateToast('Support ticket sent successfully.');
  };

  const handleApproveWithdrawal = (transactionId) => {
    setData((previous) => ({
      ...previous,
      accounts: previous.accounts.map((account) => {
        if (account.userId === user.id) {
          const tx = previous.transactions.find((t) => t.id === transactionId);
          if (tx && account.id === tx.accountId) {
            return { ...account, balance: Number(account.balance) - Number(tx.amount) };
          }
        }
        return account;
      }),
      transactions: previous.transactions.map((transaction) =>
        transaction.id === transactionId
          ? { ...transaction, status: 'Successful' }
          : transaction
      )
    }));
    updateToast('Withdrawal approved and processed.');
  };

  const handleThemeChange = (theme) => {
    setData((previous) => ({
      ...previous,
      users: previous.users.map((entry) =>
        entry.id === user.id ? { ...entry, theme } : entry
      )
    }));
  };

  const userSupportMessages = data.supportMessages.filter(
    (message) => message.userId === user?.id || message.sender === 'admin'
  );

  const shellClass = user?.theme === 'dark' ? 'theme-dark' : 'theme-light';

  return (
    <div className={`app-shell ${shellClass}`}>
      {!user ? (
        <AuthScreen
          authMode={authMode}
          setAuthMode={setAuthMode}
          signupForm={signupForm}
          setSignupForm={setSignupForm}
          signinForm={signinForm}
          setSigninForm={setSigninForm}
          handleSignup={handleSignup}
          handleSignin={handleSignin}
        />
      ) : (
        <MainLayout
          user={user}
          view={view}
          setView={setView}
          handleLogout={handleLogout}
          primaryAccount={primaryAccount}
          accountList={accountList}
          data={data}
          transferForm={transferForm}
          setTransferForm={setTransferForm}
          handleTransfer={handleTransfer}
          withdrawalForm={withdrawalForm}
          setWithdrawalForm={setWithdrawalForm}
          handleWithdrawalSubmit={handleWithdrawalSubmit}
          supportDraft={supportDraft}
          setSupportDraft={setSupportDraft}
          handleSupportMessage={handleSupportMessage}
          userSupportMessages={userSupportMessages}
          pendingWithdrawals={pendingWithdrawals}
          handleApproveWithdrawal={handleApproveWithdrawal}
          handleThemeChange={handleThemeChange}
          toast={toast}
          setToast={setToast}
          session={session}
        />
      )}
    </div>
  );
}

function AuthScreen({
  authMode,
  setAuthMode,
  signupForm,
  setSignupForm,
  signinForm,
  setSigninForm,
  handleSignup,
  handleSignin
}) {
  return (
    <div className="auth-screen">
      <div className="hero-brand">
        <div className="brand-mark">
          <span className="brand-mark-inner">F</span>
        </div>
        <div className="brand-copy">
          <h1>FlashRemit</h1>
          <p>Send • Receive • Transfer</p>
        </div>
      </div>

      <div className="auth-card">
        <div className="auth-toggle">
          <button
            className={authMode === 'signin' ? 'active' : ''}
            onClick={() => setAuthMode('signin')}
            type="button"
          >
            Sign In
          </button>
          <button
            className={authMode === 'signup' ? 'active' : ''}
            onClick={() => setAuthMode('signup')}
            type="button"
          >
            Sign Up
          </button>
        </div>

        {authMode === 'signin' ? (
          <form className="auth-form" onSubmit={handleSignin}>
            <label>
              <span>Email Address</span>
              <input
                type="email"
                value={signinForm.email}
                onChange={(event) => setSigninForm({ ...signinForm, email: event.target.value })}
                placeholder="you@example.com"
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                value={signinForm.password}
                onChange={(event) => setSigninForm({ ...signinForm, password: event.target.value })}
                placeholder="••••••••"
              />
            </label>
            <button className="primary-button" type="submit">Sign In</button>
            <div className="quick-credentials">
              <p>Admin demo:</p>
              <strong>admin@flashremit.com / admin123</strong>
            </div>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSignup}>
            <label>
              <span>Full Name</span>
              <input
                type="text"
                value={signupForm.name}
                onChange={(event) => setSignupForm({ ...signupForm, name: event.target.value })}
                placeholder="Jane Doe"
              />
            </label>
            <label>
              <span>Email Address</span>
              <input
                type="email"
                value={signupForm.email}
                onChange={(event) => setSignupForm({ ...signupForm, email: event.target.value })}
                placeholder="jane@example.com"
              />
            </label>
            <label>
              <span>Phone</span>
              <input
                type="tel"
                value={signupForm.phone}
                onChange={(event) => setSignupForm({ ...signupForm, phone: event.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                value={signupForm.password}
                onChange={(event) => setSignupForm({ ...signupForm, password: event.target.value })}
                placeholder="Create a password"
              />
            </label>
            <button className="primary-button" type="submit">Create Account</button>
          </form>
        )}
      </div>
    </div>
  );
}

function MainLayout({
  user,
  view,
  setView,
  handleLogout,
  primaryAccount,
  accountList,
  data,
  transferForm,
  setTransferForm,
  handleTransfer,
  withdrawalForm,
  setWithdrawalForm,
  handleWithdrawalSubmit,
  supportDraft,
  setSupportDraft,
  handleSupportMessage,
  userSupportMessages,
  pendingWithdrawals,
  handleApproveWithdrawal,
  handleThemeChange,
  toast,
  session
}) {
  const accountBalance = accountList.reduce((sum, account) => sum + Number(account.balance), 0);

  return (
    <div className="main-layout">
      <header className="topbar">
        <button className="menu-button" type="button" aria-label="Open menu">
          <span />
          <span />
          <span />
        </button>

        <div className="topbar-brand">
          <div className="brand-mini">F</div>
          <span>FlashRemit</span>
        </div>
      </header>

      <main className="main-content">
        {view === 'dashboard' && (
          <DashboardView
            user={user}
            setView={setView}
            primaryAccount={primaryAccount}
            accountBalance={accountBalance}
            data={data}
          />
        )}

        {view === 'transfer' && (
          <TransferView
            user={user}
            data={data}
            transferForm={transferForm}
            setTransferForm={setTransferForm}
            handleTransfer={handleTransfer}
          />
        )}

        {view === 'withdraw' && (
          <WithdrawView
            user={user}
            withdrawalForm={withdrawalForm}
            setWithdrawalForm={setWithdrawalForm}
            handleWithdrawalSubmit={handleWithdrawalSubmit}
          />
        )}

        {view === 'withdrawal-token' && (
          <WithdrawalTokenView user={user} />
        )}

        {view === 'support' && (
          <SupportView
            user={user}
            supportDraft={supportDraft}
            setSupportDraft={setSupportDraft}
            handleSupportMessage={handleSupportMessage}
            userSupportMessages={userSupportMessages}
          />
        )}

        {view === 'settings' && (
          <SettingsView
            user={user}
            handleLogout={handleLogout}
            handleThemeChange={handleThemeChange}
            data={data}
            setView={setView}
          />
        )}

        {user.role === 'admin' && view === 'admin' && (
          <AdminView
            user={user}
            pendingWithdrawals={pendingWithdrawals}
            handleApproveWithdrawal={handleApproveWithdrawal}
          />
        )}
      </main>

      {!['auth', 'withdrawal-token'].includes(view) && (
        <nav className="bottom-nav">
          <button type="button" className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}>
            Dashboard
          </button>
          <button type="button" className={view === 'transfer' ? 'active' : ''} onClick={() => setView('transfer')}>
            Transfer
          </button>
          <button type="button" className={view === 'withdraw' ? 'active' : ''} onClick={() => setView('withdraw')}>
            Withdraw
          </button>
          <button type="button" className={view === 'support' ? 'active' : ''} onClick={() => setView('support')}>
            Support
          </button>
          <button type="button" className={view === 'settings' ? 'active' : ''} onClick={() => setView('settings')}>
            Settings
          </button>
        </nav>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function DashboardView({ user, setView, primaryAccount, accountBalance, data }) {
  const recentTransactions = data.transactions
    .filter((txn) => txn.userId === user.id)
    .slice(0, 6);

  return (
    <div className="page-shell dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Hello, {user.name.split(' ')[0]}</p>
          <h2>Welcome back</h2>
        </div>
        {user.role === 'admin' && (
          <button className="desktop-button" type="button" onClick={() => setView('admin')}>
            Admin Panel
          </button>
        )}
      </div>

      <div className="account-card">
        <div className="account-meta-row">
          <span>{primaryAccount?.accountType}</span>
          <span>USD</span>
        </div>
        <div className="account-balance">{formatCurrency(primaryAccount?.balance || 0)}</div>
        <div className="account-number">{primaryAccount?.accountNumber}</div>
      </div>

      <div className="quick-actions">
        <button type="button" className="action-card" onClick={() => setView('transfer')}>
          <span>↗</span>
          Transfer
        </button>
        <button type="button" className="action-card" onClick={() => setView('withdraw')}>
          <span>↓</span>
          Withdraw
        </button>
        <button type="button" className="action-card" onClick={() => setView('support')}>
          <span>✦</span>
          Support
        </button>
      </div>

      <div className="section-panel">
        <div className="section-head">
          <h3>Recent Activity</h3>
          <button type="button" className="text-button" onClick={() => setView('transfer')}>View all</button>
        </div>

        <div className="list-stack">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="activity-item">
              <div>
                <strong>{transaction.title}</strong>
                <span>{transaction.status}</span>
              </div>
              <b>{transaction.direction === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TransferView({ user, data, transferForm, setTransferForm, handleTransfer }) {
  return (
    <div className="page-shell transfer-page">
      <h2>Transfer</h2>
      <div className="transfer-search-box">
        <input
          type="text"
          placeholder="Search recipient bank"
          defaultValue=""
        />
      </div>
      <div className="banks-grid">
        {data.recipients.map((recipient) => (
          <button
            key={recipient.id}
            type="button"
            className={transferForm.recipientId === recipient.id ? 'bank-card selected' : 'bank-card'}
            onClick={() => setTransferForm({ ...transferForm, recipientId: recipient.id })}
          >
            <span className="bank-logo">{recipient.logo}</span>
            <span>{recipient.name}</span>
          </button>
        ))}
      </div>

      <form className="inline-form" onSubmit={handleTransfer}>
        <label>
          <span>Amount</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={transferForm.amount}
            onChange={(event) => setTransferForm({ ...transferForm, amount: event.target.value })}
          />
        </label>
        <label>
          <span>Memo</span>
          <input
            type="text"
            value={transferForm.memo}
            onChange={(event) => setTransferForm({ ...transferForm, memo: event.target.value })}
          />
        </label>
        <button type="submit" className="primary-button">Send Transfer</button>
      </form>
    </div>
  );
}

function WithdrawView({ user, withdrawalForm, setWithdrawalForm, handleWithdrawalSubmit }) {
  return (
    <div className="page-shell withdraw-page">
      <h2>Withdraw</h2>
      <p className="subtitle">Withdraw funds to a bank account or card.</p>

      <div className="segmented-toggle">
        <button type="button" className={withdrawalForm.type === 'bank' ? 'selected' : ''} onClick={() => setWithdrawalForm({ ...withdrawalForm, type: 'bank' })}>
          Add Bank
        </button>
        <button type="button" className={withdrawalForm.type === 'card' ? 'selected' : ''} onClick={() => setWithdrawalForm({ ...withdrawalForm, type: 'card' })}>
          Choose Card
        </button>
      </div>

      <form className="withdraw-form" onSubmit={handleWithdrawalSubmit}>
        <div className="two-col">
          <label>
            <span>Bank Name</span>
            <input
              type="text"
              value={withdrawalForm.bankName}
              onChange={(event) => setWithdrawalForm({ ...withdrawalForm, bankName: event.target.value })}
            />
          </label>
          <label>
            <span>SWIFT/BIC</span>
            <input
              type="text"
              value={withdrawalForm.swift}
              onChange={(event) => setWithdrawalForm({ ...withdrawalForm, swift: event.target.value })}
            />
          </label>
        </div>

        <label>
          <span>Account Holder Name</span>
          <input
            type="text"
            value={withdrawalForm.accountHolder}
            onChange={(event) => setWithdrawalForm({ ...withdrawalForm, accountHolder: event.target.value })}
          />
        </label>

        <div className="two-col">
          <label>
            <span>Account Number</span>
            <input
              type="text"
              value={withdrawalForm.accountNumber}
              onChange={(event) => setWithdrawalForm({ ...withdrawalForm, accountNumber: event.target.value })}
            />
          </label>
          <label>
            <span>Amount</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={withdrawalForm.amount}
              onChange={(event) => setWithdrawalForm({ ...withdrawalForm, amount: event.target.value })}
            />
          </label>
        </div>

        <button type="submit" className="primary-button continue-button">
          <span>↓</span> Continue
        </button>
      </form>
    </div>
  );
}

function WithdrawalTokenView({ user }) {
  return (
    <div className="page-shell token-page">
      <h2>Withdrawal Token Required</h2>

      <div className="token-banner">
        <div className="token-icon">!</div>
        <div>
          <h3>WITHDRAWAL TOKEN REQUIRED</h3>
          <p>A withdrawal token is required to complete your withdrawal.</p>
        </div>
      </div>

      <div className="asset-box">
        <h3>Available Withdrawal Assets</h3>
        <ul>
          <li>• USDT</li>
          <li>• SOL</li>
          <li>• E-code</li>
        </ul>
      </div>

      <div className="support-message">
        <p>
          Please contact FlashRemit Support for information on obtaining your withdrawal token and completing the withdrawal process.
        </p>
        <p>
          Once your token has been verified, you can proceed with your withdrawal.
        </p>
      </div>

      <button className="support-action" type="button">Contact FlashRemit Support</button>

      <div className="details-grid">
        <span>Withdrawal Amount</span>
        <strong>€3090,20</strong>
        <span>Reference ID</span>
        <strong>FR-ATW69QQA</strong>
        <span>Withdrawal Status</span>
        <strong>Pending</strong>
      </div>
    </div>
  );
}

function SupportView({ user, supportDraft, setSupportDraft, handleSupportMessage, userSupportMessages }) {
  return (
    <div className="page-shell support-page">
      <h2>Customer Support</h2>
      <div className="support-thread">
        {userSupportMessages.map((message) => (
          <div key={message.id} className={message.sender === 'user' ? 'bubble user' : 'bubble admin'}>
            <p>{message.text}</p>
          </div>
        ))}
      </div>

      <form className="support-form" onSubmit={handleSupportMessage}>
        <textarea
          value={supportDraft}
          onChange={(event) => setSupportDraft(event.target.value)}
          placeholder="Write a message..."
        />
        <button type="submit" className="primary-button">Send</button>
      </form>
    </div>
  );
}

function SettingsView({ user, handleLogout, handleThemeChange, data, setView }) {
  const firstAccount = data.accounts.find((account) => account.userId === user.id);

  return (
    <div className="page-shell settings-page">
      <h2>Settings</h2>

      <div className="settings-card">
        <div className="settings-row">
          <span>Profile</span>
          <button type="button">Manage</button>
        </div>
        <div className="settings-row">
          <span>Theme</span>
          <div className="segmented-mini">
            <button type="button" className={user.theme !== 'dark' ? 'selected' : ''} onClick={() => handleThemeChange('light')}>Light</button>
            <button type="button" className={user.theme === 'dark' ? 'selected' : ''} onClick={() => handleThemeChange('dark')}>Dark</button>
          </div>
        </div>
        <div className="settings-row">
          <span>Face ID</span>
          <button type="button">{user.faceIdEnabled ? 'On' : 'Off'}</button>
        </div>
        <div className="settings-row">
          <span>Notifications</span>
          <button type="button">Enabled</button>
        </div>
        <div className="settings-row">
          <span>Account Number</span>
          <button type="button">Copy</button>
        </div>
        <div className="settings-row">
          <span>Customer Support</span>
          <button type="button" onClick={() => setView('support')}>Open</button>
        </div>
        <div className="settings-row">
          <span>Security</span>
          <button type="button">Manage</button>
        </div>
        <div className="settings-row logout-row">
          <button type="button" className="danger-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="info-card">
        <p>Primary Account</p>
        <strong>{firstAccount?.accountNumber || 'Account Not Found'}</strong>
      </div>
    </div>
  );
}

function AdminView({ user, pendingWithdrawals, handleApproveWithdrawal }) {
  return (
    <div className="page-shell admin-page">
      <h2>Admin Dashboard</h2>
      <div className="admin-list">
        {pendingWithdrawals.length === 0 ? (
          <p>No pending withdrawal requests.</p>
        ) : (
          pendingWithdrawals.map((withdrawal) => (
            <div key={withdrawal.id} className="admin-request">
              <div>
                <strong>{withdrawal.counterparty}</strong>
                <span>{withdrawal.reference}</span>
              </div>
              <div className="right-side">
                <b>{formatCurrency(withdrawal.amount)}</b>
                <button type="button" onClick={() => handleApproveWithdrawal(withdrawal.id)}>Approve</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
