import { Box, Typography } from "@mui/material";
import TaskInput from "../TaskInput";

import { CustomizedSectionBox } from "./styles";
import { useEffect, useState } from "react";
import axios from "axios";

import { url_categorias } from "../../utils/api";
import { Categoria, Tarefa } from "../../utils/model";
import TaskList from '../TaskList';
import { MainProps } from "./Main";

const Main = (props: MainProps) => {
  const { categorias } = props;

  const [selectedTaskInput, setSelectedTaskInput] = useState<string | null>(
    null
  );
  const [refetchtaskStatus, setRefectchTaskStatus] = useState<number>(0);

  const renderCategoriaSection = (categoria_item: Categoria) => {
    return (
      <CustomizedSectionBox key={categoria_item.id} pt={2} pb={1}>
        <Typography
          variant="h2"
          sx={{
            fontSize: "2rem",
            marginBottom: "8px",
          }}
        >
          {" "}
          {categoria_item.descricao}{" "}
        </Typography>

        <TaskList categoria={categoria_item} taskStatus={refetchtaskStatus}/>

        {selectedTaskInput === null ||
        selectedTaskInput === categoria_item.descricao ? (
          <TaskInput
            category={categoria_item}
            onSelectCreateTask={(category) => {
              setSelectedTaskInput(category);
              setRefectchTaskStatus(refetchtaskStatus+1);
            }}
          />
        ) : null}
      </CustomizedSectionBox>
    );
  };

  return (
    <Box
      display="flex"
      flexWrap={"wrap"}
      sx={{
        textAlign: "center",
        maxWidth: "720px",
        margin: "0 auto",
      }}
    >
      <CustomizedSectionBox>
        <Typography
          variant="h1"
          sx={{
            fontSize: "3rem",
          }}
        >
          {" "}
          Suas tarefas{" "}
        </Typography>
      </CustomizedSectionBox>
      {categorias.map((categoria) => renderCategoriaSection(categoria))}
    </Box>
  );
};

const MainWrapper = () => {
  const [categorias, setCategorias] = useState<null | Categoria[]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(url_categorias);
      setCategorias(response.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (categorias) {
    return <Main categorias={categorias} />;
  }

  return <div>Carregando!</div>;
};

export default MainWrapper;
