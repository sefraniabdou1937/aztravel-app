// Chakra imports
import {
  Box,
  Flex,
  Text,
  Icon,
  useColorModeValue,
  Checkbox,
  Spinner,
  Input,
  Button,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React from "react";
// --- NOUVEAU: Import du "cerveau" ---
import { useAuth } from "contexts/AuthContext";
import { MdCheckBox, MdDragIndicator, MdDelete } from "react-icons/md";

export default function Tasks({ onTaskChange, ...rest }) {
  // --- NOUVEAU: Connexion au "cerveau" ---
  const { token } = useAuth(); // On récupère le token

  // --- ÉTATS (STATES) ---
  const [tasks, setTasks] = React.useState([]); // Commence toujours par une liste vide
  const [loading, setLoading] = React.useState(false); // On ne charge pas au début
  const [newTaskName, setNewTaskName] = React.useState("");

  // --- CHARGEMENT DES TÂCHES (GET) ---
  const fetchTasks = () => {
    if (!token) return; // Ne rien faire si pas de token
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/tasks", {
      headers: {
        "Authorization": `Bearer ${token}` // <-- Envoyer le token !
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) { // <-- Sécurité: on vérifie si c'est bien une liste
          setTasks(data);
        } else {
          setTasks([]); // En cas d'erreur, on met une liste vide
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur de chargement des tâches:", err);
        setLoading(false);
      });
  };

  // --- AJOUT D'UNE TÂCHE (POST) ---
  const handleAddTask = () => {
    if (newTaskName.trim() === "" || !token) return; // Sécurité
    fetch("http://127.0.0.1:8000/api/tasks", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // <-- Envoyer le token !
      },
      body: JSON.stringify({ name: newTaskName }),
    })
      .then((response) => response.json())
      .then((newTask) => {
        setNewTaskName("");
        fetchTasks(); 
        if (onTaskChange) onTaskChange();
      })
      .catch((err) => console.error("Erreur d'ajout de tâche:", err));
  };

  // --- MISE À JOUR D'UNE TÂCHE (PUT) ---
  const handleToggleTask = (taskId) => {
    if (!token) return; // Sécurité
    fetch(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}` // <-- Envoyer le token !
      }
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        setTasks(tasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        ));
        if (onTaskChange) onTaskChange();
      })
      .catch((err) => console.error("Erreur de mise à jour:", err));
  };

  // --- SUPPRIMER UNE TÂCHE (DELETE) ---
  const handleDeleteTask = (taskId) => {
    if (!token) return; // Sécurité
    fetch(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}` // <-- Envoyer le token !
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          setTasks(tasks.filter(task => task.id !== taskId));
          if (onTaskChange) onTaskChange();
        }
      })
      .catch((err) => console.error("Erreur de suppression:", err));
  };

  // --- MODIFIÉ: CHARGEMENT INITIAL ---
  React.useEffect(() => {
    if (token) { // On ne charge les tâches que si le token existe
      fetchTasks();
    }
  }, [token]); // Se déclenche quand le token apparaît

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const brandColor = useColorModeValue("brand.500", "white");

  // Si on n'est pas connecté (pas de token), on n'affiche rien du tout
  if (!token) {
    return null; 
  }

  return (
    <Card {...rest} direction='column' w='100%' px='0px' overflowX={{ sm: "scroll", lg: "hidden" }}>
      {/* --- TITRE --- */}
      <Flex px='25px' justify='space-between' mb='20px' align='center'>
        <Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
          Checklist de Voyage
        </Text>
      </Flex>
      <Box px='25px'>

        {/* --- FORMULAIRE D'AJOUT --- */}
        <Flex mb='20px' gap='10px'>
          <Input
            placeholder='Ex: Préparer le passeport'
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') handleAddTask(); }}
          />
          <Button onClick={handleAddTask} colorScheme='brand'>
            Ajouter
          </Button>
        </Flex>

        {/* --- AFFICHAGE DE LA LISTE --- */}
        {loading && (
          <Flex justify='center' align='center' h='100px'>
            <Spinner color={brandColor} />
          </Flex>
        )}
        {!loading && tasks.length === 0 && (
          <Text color={textColorSecondary} textAlign='center' mb='20px'>
            Aucune tâche dans la checklist.
          </Text>
        )}

        {!loading && tasks.map((task) => (
          <Flex
            key={task.id}
            mb='20px'
            align='center'
          >
            <Checkbox 
              colorScheme='brandScheme' 
              me='16px' 
              isChecked={task.is_done}
              onChange={() => handleToggleTask(task.id)}
            />
            <Text
              fontWeight='bold'
              color={textColor}
              fontSize='md'
              textAlign='start'
              textDecoration={task.is_done ? "line-through" : "none"}
            >
              {task.name}
            </Text>
            
            <Icon
              ms='auto'
              as={MdDelete}
              color='secondaryGray.600'
              w='20px'
              h='20px'
              cursor='pointer'
              onClick={() => handleDeleteTask(task.id)}
            />
          </Flex>
        ))}
      </Box>
    </Card>
  );
}