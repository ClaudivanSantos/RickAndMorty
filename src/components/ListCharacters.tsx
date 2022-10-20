import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Divider,
  Pagination,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Loader } from "../utils/Loader";
import { apiCharacter } from "../services/api";
import Header from "../layout/Header";

export interface ICharacters {
  id: number;
  name: string;
  image: string;
  species: string;
  gender: string;
  status: string;
}

export function ListCharacters() {
  const matches = useMediaQuery("(min-width:500px)");
  const [characters, setCharacters] = useState<ICharacters[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [qtdPage, setQtdPage] = useState();
  const [text, setText] = useState('');

  async function getCharacters() {
    setIsLoading(true);
    const response = await apiCharacter.get(`?page=${currentPage}`);
    if (response) {
      setCharacters(response.data.results);
      setQtdPage(response.data.info.pages);
      setIsLoading(false);
    }
  }
  useEffect(() => {
    getCharacters();
  }, [currentPage]);

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  async function getCharactersByName() {
    setIsLoading(true);
    const response = await apiCharacter.get(`?name=${text}`);
    if (response) {
      setCharacters(response.data.results);
      setQtdPage(response.data.info.pages);
      setIsLoading(false);
    }
    setIsLoading(false);
  }

  return (
    <>
      {isLoading ? (
        <Loader Circular={isLoading} />
      ) : (
        <>
          <Header />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <TextField
              sx={{ color: "white" }}
              size="small"
              label="Digite um nome"
              onChange={(e) => setText(e.target.value)}
            />
            <Button
              sx={{ backgroundColor: "#6E22B5", marginBottom: "20px" }}
              variant="contained"
              onClick={getCharactersByName}
            >
              Buscar
            </Button>
          </Box>
          <Box display="flex" justifyContent="center" flexWrap="wrap">
            {characters.map((character) => (
              <motion.div
                whileHover={{
                  scale: 1.05,
                  textShadow: "0px 0px 2px gray",
                }}
              >
                <Link
                  style={{ textDecoration: "none" }}
                  state={character}
                  to={`character/${character.id}`}
                >
                  <Box
                    sx={{
                      backgroundColor: "#191b1c",
                      borderRadius: "0.4rem",
                      margin: "5px",
                      textAlign: "center",
                    }}
                  >
                    <Button
                      sx={{ marginTop: "5px" }}
                      color={character.status == "Alive" ? "success" : "error"}
                      variant="outlined"
                    >
                      {character.status}
                    </Button>
                    <Divider />
                    <Box
                      component="img"
                      sx={{
                        height: matches ? 190 : 120,

                        borderRadius: "0.4rem",
                        margin: "7px",
                        cursor: "pointer",
                      }}
                      src={character.image}
                    />
                    <Typography>{character.name}</Typography>
                    <Typography>{character.gender}</Typography>
                    <Typography>{character.species}</Typography>
                  </Box>
                </Link>
              </motion.div>
            ))}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              defaultPage={1}
              variant="outlined"
              color="primary"
              sx={{ marginTop: "25px", marginBottom: "25px" }}
              size={matches ? "large" : "medium"}
              count={qtdPage}
              page={currentPage}
              onChange={handleChange}
            />
          </Box>
        </>
      )}
    </>
  );
}