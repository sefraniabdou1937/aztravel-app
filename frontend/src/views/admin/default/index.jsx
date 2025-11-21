// Chakra imports
import {
  Box,
  Flex,
  Select,
  SimpleGrid,
  useColorModeValue,
  Text,
  Input,
  Icon,
} from "@chakra-ui/react";
import React, { useCallback } from "react"; // <-- MODIFIÉ

// CORRECTION : Séparez l'importation de useAuth
import { useAuth } from "contexts/AuthContext"; // Assurez-vous que le chemin est correct

// Custom components
import MiniCalendar from "components/calendar/MiniCalendar";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import Card from "components/card/Card.js";
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFlightTakeoff, // <-- On garde celui-là
  MdCheckCircle, // <-- J'ai mis une icône plus logique pour la progression
} from "react-icons/md";

// Composants du Dashboard
import CheckTable from "views/admin/default/components/CheckTable";
import Tasks from "views/admin/default/components/Tasks";
import TotalSpent from "views/admin/default/components/TotalSpent";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";

// On garde les devises d'origine
const originCurrencies = [
  { code: "EUR", name: "Euro (€)" },
  { code: "USD", name: "US Dollar ($)" },
  { code: "GBP", name: "Livre Sterling (£)" },
  { code: "MAD", name: "Dirham Marocain (DH)" },
];

// --- FONCTION UTILITAIRE DATE ---
const formatDate = (date) => {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join("-");
};

export default function UserReports() {
  const { token } = useAuth(); // Le token est maintenant accessible
  
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const textColor = useColorModeValue("secondaryGray.900", "white");

  // --- ÉTATS ---
  const [weather, setWeather] = React.useState({ temp: "--", city: "Sélectionnez une ville", desc: "En attente" });
  const [forecast, setForecast] = React.useState(null);
  const [photos, setPhotos] = React.useState(null);
  const [taskStats, setTaskStats] = React.useState({ total_tasks: 0, pending_tasks: 0 });
  const [chatHistory, setChatHistory] = React.useState([]);

  // États Sélection
  const [selectedCountry, setSelectedCountry] = React.useState("");
  const [availableCities, setAvailableCities] = React.useState([]);
  const [selectedCity, setSelectedCity] = React.useState("");

  // --- LISTE DES PAYS (API) ---
  const [countriesList, setCountriesList] = React.useState([]);
  const [isCountriesLoading, setIsCountriesLoading] = React.useState(true);
  const [isCitiesLoading, setIsCitiesLoading] = React.useState(false);

  // États Divers
  const [originCurrency, setOriginCurrency] = React.useState("");
  const [targetCurrency, setTargetCurrency] = React.useState("");
  const [currencyRate, setCurrencyRate] = React.useState(null);
  const [budgetInput, setBudgetInput] = React.useState("100");
  const convertedBudget = (parseFloat(budgetInput) * (currencyRate?.rate || 0)).toFixed(2);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [flightResult, setFlightResult] = React.useState(null);
  const [visaStatus, setVisaStatus] = React.useState(null);

  // Calcul Pourcentage (Maintenant utilisé !)
  const tasksCompleted = taskStats.total_tasks - taskStats.pending_tasks;
  const completionPercentage = taskStats.total_tasks > 0
    ? ((tasksCompleted / taskStats.total_tasks) * 100).toFixed(0) : 0;

  // --- FONCTION : RAFRAÎCHIR LES STATS ---
  const refreshTaskStats = React.useCallback(() => { // <-- AJOUTER useCallback
    if (!token) return;
    fetch("http://127.0.0.1:8000/api/tasks/stats", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.detail) { setTaskStats(data); }
      })
      .catch((err) => console.error("Erreur stats tâches:", err));
  }, [token]);
  
  // --- 1. CHARGEMENT INITIAL ---
  React.useEffect(() => {
    if (token) {
      refreshTaskStats();

      // Charger la liste des pays
      setIsCountriesLoading(true);
      fetch("http://127.0.0.1:8000/api/countries")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setCountriesList(data);
          }
          setIsCountriesLoading(false);
        })
        .catch(err => {
          console.error("Erreur chargement pays:", err);
          setIsCountriesLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // On ignore l'avertissement ici car on veut que ça tourne une seule fois au début

  // --- 2. CHARGEMENT TAUX DE CHANGE ---
  React.useEffect(() => {
    if (originCurrency && targetCurrency && token) {
      if (originCurrency === targetCurrency) {
        setCurrencyRate({ rate: 1, base: originCurrency, target: targetCurrency });
        return;
      }
      setCurrencyRate(null);
      fetch(`http://127.0.0.1:8000/api/currency/rate/${originCurrency}/${targetCurrency}`)
        .then(res => res.json())
        .then(data => { if (data.rate) setCurrencyRate(data); })
        .catch(err => console.error("Erreur Taux:", err));
    }
  }, [originCurrency, targetCurrency, token]);

  // --- 3. FONCTION REFRESH MODULES ---
  const refreshCityModules = (cityName, dateObj) => {
    if (!cityName) return;
    const formattedDate = formatDate(dateObj);

    // Météo
    setWeather({ temp: "--", city: cityName, desc: "Chargement..." });
    fetch(`http://127.0.0.1:8000/api/weather/${cityName}?date=${formattedDate}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setWeather({ temp: data.temperature, city: data.ville, desc: data.description });
      });

    // Forecast
    setForecast(null);
    fetch(`http://127.0.0.1:8000/api/weather/forecast/${cityName}?start_date=${formattedDate}`)
      .then(res => res.json()).then(data => { if (!data.error) setForecast(data); });

    // Vols
    setFlightResult(null);
    fetch(`http://127.0.0.1:8000/api/flights/${cityName}?departure_date=${formattedDate}`)
      .then(res => res.json()).then(data => { if (data && !data.error) setFlightResult(data); else setFlightResult({ error: true }); });
  }

  const handleDateChange = (value) => {
    const newDate = Array.isArray(value) ? value[0] : value;
    setSelectedDate(newDate);
    if (selectedCity) refreshCityModules(selectedCity, newDate);
  };

  // --- 4. GESTIONNAIRES PAYS/VILLE ---
  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    setSelectedCountry(countryName);

    const countryObj = countriesList.find((c) => c.name === countryName);
    if (countryObj) setTargetCurrency(countryObj.currency);

    setAvailableCities([]);
    setIsCitiesLoading(true);

    if (countryName) {
      fetch(`http://127.0.0.1:8000/api/cities/${encodeURIComponent(countryName)}`)
        .then(res => res.json())
        .then(data => {
          if (data.cities && Array.isArray(data.cities)) {
            const sortedCities = data.cities.sort();
            setAvailableCities(sortedCities);
          }
          setIsCitiesLoading(false);
        })
        .catch(err => {
          console.error("Erreur villes:", err);
          setIsCitiesLoading(false);
        });

      setVisaStatus(null);
      fetch(`http://127.0.0.1:8000/api/visa/${countryName}`)
        .then(res => res.json()).then(data => setVisaStatus(data));
    }

    // Reset
    setWeather({ temp: "--", city: "Choisissez une ville...", desc: "" });
    setForecast(null);
    setPhotos(null);
    setSelectedCity("");
    setChatHistory([]);
    setCurrencyRate(null);
    setFlightResult(null);
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    if (!cityName) return;

    if (availableCities.includes(cityName)) {
      setSelectedCity(cityName);

      const welcomePrompt = `Donne-moi une très courte description (2-3 phrases) de la ville de ${cityName}. Commence par "Bienvenue à ${cityName} !".`;
      setChatHistory([{ role: "model", text: "Génération d'une description..." }]);
      if (token) {
        fetch("http://127.0.0.1:8000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ prompt: welcomePrompt, city: cityName }),
        }).then(res => res.json()).then(data => {
          if (data.response) setChatHistory([{ role: "model", text: data.response }]);
        });
      }

      refreshCityModules(cityName, selectedDate);

      fetch(`http://127.00.0.1:8000/api/photos/${cityName}`)
        .then(res => res.json()).then(data => { if (data.photos) setPhotos(data.photos); });
    }
  };

  const handleOriginCurrencyChange = (e) => setOriginCurrency(e.target.value);

  const handleSendChat = (prompt) => {
    if (!token || !selectedCity || prompt.trim() === "") return;
    setChatHistory((prev) => [...prev, { role: "user", text: prompt }]);
    fetch("http://127.0.0.1:8000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ prompt: prompt, city: selectedCity }),
    }).then(res => res.json()).then(data => {
      if (data.response) setChatHistory((prev) => [...prev, { role: "model", text: data.response }]);
    });
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>

      <Flex mb='20px' gap='20px' alignItems='center' flexWrap='wrap'>
        <Box>
          <Text mb='5px' color={textColor} fontSize='sm' fontWeight='700'>Votre devise (Origine)</Text>
          <Select placeholder='Choisir devise' bg='white' w='200px' onChange={handleOriginCurrencyChange}>
            {originCurrencies.map((c, index) => (
              <option key={index} value={c.code}>{c.name}</option>
            ))}
          </Select>
        </Box>
        <Box>
          <Text mb='5px' color={textColor} fontSize='sm' fontWeight='700'>Pays de destination</Text>
          <Select
            placeholder={isCountriesLoading ? 'Chargement...' : 'Choisir un pays'}
            bg='white'
            w='200px'
            onChange={handleCountryChange}
          >
            {countriesList.map((country, index) => (
              <option key={index} value={country.name}>{country.name}</option>
            ))}
          </Select>
        </Box>
        <Box>
          <Text mb='5px' color={textColor} fontSize='sm' fontWeight='700'>Ville de destination</Text>
          <Input
            list="city-options"
            placeholder={!selectedCountry ? 'D\'abord le pays...' : (isCitiesLoading ? 'Chargement...' : 'Ecrivez pour chercher...')}
            bg='white'
            w='200px'
            disabled={!selectedCountry || isCitiesLoading}
            onChange={handleCityChange}
          />
          <datalist id="city-options">
            {availableCities.map((city, index) => (
              <option key={index} value={city} />
            ))}
          </datalist>
        </Box>
      </Flex>

      {/* --- GRILLE DE STATS --- */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }} gap='20px' mb='20px'>
        <MiniStatistics
          startContent={<IconBox w='56px' h='56px' bg={boxBg} icon={<Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />} />}
          name={`Météo à ${weather.city}`}
          value={`${weather.temp}°C`}
          growth={weather.desc}
        />
        <MiniStatistics
          startContent={<IconBox w='56px' h='56px' bg={boxBg} icon={<Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />} />}
          name={currencyRate ? `1 ${currencyRate.base} =` : "Taux de change"}
          value={currencyRate ? `${currencyRate.rate} ${currencyRate.target}` : "Sélectionnez..."}
        />
        <MiniStatistics growth='Total' name='Tâches Totales Créées' value={taskStats.total_tasks.toString()} />

        <Card p='20px'>
          <Flex direction='column' h='100%'>
            <Text fontSize='md' fontWeight='500' color='secondaryGray.600'>Convertisseur</Text>
            <Flex align='center' mt='10px'>
              <Input type='number' w='100px' fontWeight='700' fontSize='2xl' value={budgetInput} onChange={(e) => setBudgetInput(e.target.value)} />
              <Text fontSize='xl' fontWeight='700' color={textColor} ml='10px'>{currencyRate ? currencyRate.base : "---"}</Text>
            </Flex>
            <Text fontSize='sm' color='secondaryGray.600' mt='10px'>Soit :</Text>
            <Text fontSize='3xl' fontWeight='700' color={brandColor}>{currencyRate ? `${convertedBudget} ${currencyRate.target}` : "..."}</Text>
          </Flex>
        </Card>

        <MiniStatistics
          startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)' icon={<Icon w='28px' h='28px' as={MdAddTask} color='white' />} />}
          name='Tâches restantes'
          value={(taskStats?.pending_tasks || 0).toString()}
        />

        <MiniStatistics
          growth={visaStatus ? visaStatus.details : 'N/A'}
          name={visaStatus ? `Visa : ${visaStatus.status}` : 'Visa : Info'}
          value={visaStatus ? 'Passeport' : '---'}
          growthColor={visaStatus ? visaStatus.color : 'red.500'}
        />

        <MiniStatistics
          startContent={<IconBox w='56px' h='56px' bg={boxBg} icon={<Icon w='32px' h='32px' as={MdFlightTakeoff} color={brandColor} />} />}
          name={flightResult && !flightResult.error ? "Vol (CMN)" : "Vol (Info)"}
          value={flightResult && !flightResult.error ? (flightResult.price || "N/A") : "..."}
          growth={flightResult && !flightResult.error ? `${flightResult.airline_name || 'N/A'}` : (flightResult ? "Aucun vol" : "Sélectionnez")}
        />

        {/* --- CARTE PROGRESSION (Corrigée) --- */}
        <MiniStatistics
          startContent={<IconBox w='56px' h='56px' bg={boxBg} icon={<Icon w='32px' h='32px' as={MdCheckCircle} color={brandColor} />} />}
          name='Progression'
          value={`${completionPercentage}%`}
          growth={tasksCompleted > 0 ? `${tasksCompleted} Terminées` : 'Zéro'}
        />
      </SimpleGrid>

      {/* --- GRILLE PRINCIPALE --- */}
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
        <TotalSpent forecastData={forecast} selectedCity={selectedCity} flightData={flightResult} />
        <WeeklyRevenue photoData={photos} />
      </SimpleGrid>

      {/* --- GRILLE SECONDAIRE --- */}
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        <CheckTable
          chatHistory={chatHistory}
          onSend={handleSendChat}
          selectedCity={selectedCity}
        />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <Tasks onTaskChange={refreshTaskStats} />
          <MiniCalendar h='100%' minW='100%' selectRange={false} onChange={handleDateChange} />
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );
}