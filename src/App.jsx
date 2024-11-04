import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import './App.css';
import AntivirusCard from './components/AntivirusCard';

function App() {
  const companyName = "SecureShield Antivirus";
  const companyDescription = "În lumea digitală de azi, protecția împotriva amenințărilor cibernetice este mai importantă ca niciodată. SecureShield Antivirus îți oferă soluții de securitate complete, pentru a te proteja de viruși, malware și alte atacuri cibernetice. Cu o tehnologie avansată și actualizări continue, SecureShield îți oferă o protecție de top, astfel încât să navighezi online în siguranță.";
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showServerErrorPopup, setShowServerErrorPopup] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  setTimeout(() => setShowServerErrorPopup(false), 5000);


  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Detalii Factură', 10, 10);
    doc.text(`Nume: ${userInfo.name}`, 10, 20);
    doc.text(`Prenume: ${userInfo.firstname}`, 10, 30);
    doc.text(`Email: ${userInfo.email}`, 10, 40);
    doc.text(`Telefon: ${userInfo.phone}`, 10, 50);
    doc.text(`Țară: ${userInfo.country}`, 10, 60);
    doc.text(`Județ: ${userInfo.region}`, 10, 70);
    doc.text(`Pachet: ${selectedPackage.name}`, 10, 80);
    doc.text(`Durată: ${selectedDuration} luni`, 10, 90);
    doc.text(`Subtotal: RON ${subtotal.toFixed(2)}`, 10, 100);
    doc.text(`TVA (19%): RON ${tva.toFixed(2)}`, 10, 110);
    doc.text(`Total: RON ${totalPrice.toFixed(2)}`, 10, 120);

    doc.save('factura.pdf');
  };

  const antivirusPackages = [
    {
      name: 'Premium Security',
      price: 319.99,
      devices: '10',
      duration: '1 an',
      description: 'Oferă protecție completă pentru toate dispozitivele tale, incluzând protecție împotriva phishing-ului și ransomware-ului. Protecție pentru mai multe sisteme de operare, inclusiv MacOS, iOS și Android'
    },
    {
      name: 'Total Security',
      price: 239.99,
      devices: '5',
      duration: '1 an',
      description: 'Protecție avansată pentru a-ți asigura confidențialitatea datelor și a te proteja în timpul navigării pe internet Protecție pentru mai multe sisteme de operare, inclusiv MacOS, iOS și Android.'
    },
    {
      name: 'Antivirus Plus',
      price: 114.99,
      devices: '3',
      duration: '1 an',
      description: 'Protecție de bază împotriva virușilor, ideală pentru uz personal și pentru protecția dispozitivelor de zi cu zi. Protectie doar pentru Windows.'
    },
  ];


  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(3);
  const [userInfo, setUserInfo] = useState({
    name: '',
    firstname: '',
    email: '',
    phone: '',
    country: '',
    region: '',
  });
  const [errors, setErrors] = useState({});
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const TVA_RATE = 0.19;
  const subtotal = selectedPackage ? selectedPackage.price * selectedDuration : 0;
  const tva = subtotal * TVA_RATE;
  const totalPrice = subtotal + tva;

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setSelectedDuration(3);
    setErrors((prevErrors) => ({ ...prevErrors, selectedPackage: '' }));
  };

  const handleDurationChange = (duration) => {
    setSelectedDuration(duration);
  };

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    validateFields(); // Verifică validitatea formularului la fiecare modificare
  };


  const validateField = (name, value) => {
    const newErrors = {};
    const namePattern = /^[a-zA-Z-]{2,}$/;
    const phonePattern = /^\d{10}$/;

    if (name === 'name') {
      if (!value) {
        newErrors.name = 'Numele este obligatoriu.';
      } else if (!namePattern.test(value)) {
        newErrors.name = 'Numele trebuie să conțină doar litere și cratime și să aibă cel puțin 2 caractere.';
      }
    }

    if (name === 'firstname') {
      if (!value) {
        newErrors.firstname = 'Prenumele este obligatoriu.';
      } else if (!namePattern.test(value)) {
        newErrors.firstname = 'Prenumele trebuie să conțină doar litere și cratime și să aibă cel puțin 2 caractere.';
      }
    }

    if (name === 'email') {
      if (!value) {
        newErrors.email = 'Email-ul este obligatoriu.';
      } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
        newErrors.email = 'Email-ul nu este valid.';
      }
    }

    if (name === 'phone') {
      if (!value) {
        newErrors.phone = 'Telefonul este obligatoriu.';
      } else if (!phonePattern.test(value)) {
        newErrors.phone = 'Numărul de telefon trebuie să conțină exact 10 cifre și doar cifre.';
      }
    }

    if (name === 'country' && !value) {
      newErrors.country = 'Selectați o țară.';
    }

    if (name === 'region' && !value) {
      newErrors.region = 'Selectați un județ.';
    }

    setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const[isFormValid, setIsFormValid] = useState(false);

  const validateFields = () => {
    const newErrors = {};

    validateField('name', userInfo.name);
    validateField('firstname', userInfo.firstname);
    validateField('email', userInfo.email);
    validateField('phone', userInfo.phone);
    validateField('country', userInfo.country);
    validateField('region', userInfo.region);

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateFields()) {
      setShowErrorPopup(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setShowErrorPopup(false), 3000);
      return;
    }
  
    const invoiceDate = new Date().toISOString();
    const dataToSend = {
      userInfo,
      selectedPackage: {
        name: selectedPackage.name,
        pricePerMonth: selectedPackage.price,
        devices: selectedPackage.devices,
      },
      duration: selectedDuration,
      subtotal: subtotal.toFixed(2),
      tva: tva.toFixed(2),
      totalPrice: totalPrice.toFixed(2),
      invoiceDate,
    };
  
    fetch('http://localhost:5000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Eroare la trimiterea datelor');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Răspuns de la backend:', data);
        setShowSuccessPopup(true);
        generatePDF();
        setTimeout(() => setShowSuccessPopup(false), 3000);
      })
      .catch((error) => {
        setServerErrorMessage(error.message);
        setShowServerErrorPopup(true);
        setTimeout(() => setShowServerErrorPopup(false), 5000); // Ascunde popup-ul de eroare după 5 secunde
      });
  };
  


  return (
    <div className="App">
      {showSuccessPopup && (
        <div className="success-popup">
          Datele au fost trimise cu succes!
        </div>
      )}
      {showServerErrorPopup && (
        <div className="error-popup">
          {serverErrorMessage}
        </div>
      )}
      <header>
        <h1>{companyName}</h1>
        <p className="company-description">{companyDescription}</p>
      </header>
      <h2>Informații Utilizator</h2>
      <div className="user-info-form">
        <div className="input-group">
          <div className="form-group">
            <label htmlFor="name">Nume:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userInfo.name}
              onChange={handleUserInfoChange}
              onBlur={handleBlur}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="firstname">Prenume:</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={userInfo.firstname}
              onChange={handleUserInfoChange}
              onBlur={handleBlur}
            />
            {errors.firstname && <p className="error">{errors.firstname}</p>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userInfo.email}
            onChange={handleUserInfoChange}
            onBlur={handleBlur}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Telefon:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={userInfo.phone}
            onChange={handleUserInfoChange}
            onBlur={handleBlur}
          />
          {errors.phone && <p className="error">{errors.phone}</p>}
        </div>

        <div className="input-group">
          <div className="form-group">
            <label htmlFor="country">Țară:</label>
            <select
              id="country"
              name="country"
              value={userInfo.country}
              onChange={(e) => {
                handleUserInfoChange(e);
                setUserInfo((prev) => ({ ...prev, region: '' }));
              }}
              onBlur={handleBlur}
            >
              <option value="" label="Selectați o țară" />
              <option value="romania">România</option>
              <option value="moldova">Moldova</option>
            </select>
            {errors.country && <p className="error">{errors.country}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="region">Județ:</label>
            <select
              id="region"
              name="region"
              value={userInfo.region}
              onChange={handleUserInfoChange}
              onBlur={handleBlur}
            >
              <option value="" label="Selectați un județ" />
              {userInfo.country === 'romania' && (
                <>
                  <option value="bucuresti">București</option>
                  <option value="cluj">Cluj</option>
                  <option value="iasi">Iași</option>
                </>
              )}
              {userInfo.country === 'moldova' && (
                <>
                  <option value="chisinau">Chișinău</option>
                  <option value="balti">Bălți</option>
                </>
              )}
            </select>
            {errors.region && <p className="error">{errors.region}</p>}
          </div>
        </div>
      </div>

      <h2>Pachete Antivirus</h2>
      <div className="cards-container">
        {antivirusPackages.map((pkg, index) => (
          <div key={index} onClick={() => handlePackageSelect(pkg)}>
            <AntivirusCard
              name={pkg.name}
              price={pkg.price}
              devices={pkg.devices}
              duration={pkg.duration}
            />
          </div>
        ))}
        {errors.selectedPackage && <p className="error">{errors.selectedPackage}</p>}
      </div>

      {selectedPackage && (
        <div className="selection-container">
          <h2>Pachet selectat: {selectedPackage.name}</h2>
          <p> <strong>Preț pe lună: </strong>RON {selectedPackage.price}</p>
          <p><strong>Descriere: </strong>{selectedPackage.description}</p> {/* Afișează descrierea aici */}

          <div className="duration-options">
            <label>
              <input
                type="radio"
                name="duration"
                value="3"
                checked={selectedDuration === 3}
                onChange={() => handleDurationChange(3)}
              />
              3 luni
            </label>
            <label>
              <input
                type="radio"
                name="duration"
                value="6"
                checked={selectedDuration === 6}
                onChange={() => handleDurationChange(6)}
              />
              6 luni
            </label>
            <label>
              <input
                type="radio"
                name="duration"
                value="9"
                checked={selectedDuration === 9}
                onChange={() => handleDurationChange(9)}
              />
              9 luni
            </label>
            <label>
              <input
                type="radio"
                name="duration"
                value="12"
                checked={selectedDuration === 12}
                onChange={() => handleDurationChange(12)}
              />
              12 luni
            </label>
          </div>

          <div className="price-summary">
            <p>Subtotal: RON {subtotal.toFixed(2)}</p>
            <p>TVA (19%): RON {tva.toFixed(2)}</p>
            <p className="total-price">Total: RON {totalPrice.toFixed(2)}</p>
          </div>

          <button className="submit-button"
            onClick={handleSubmit}
            disabled={!isFormValid}>
            Confirmă și trimite
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
