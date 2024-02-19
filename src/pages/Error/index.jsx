import {
  Button,
  Container,
  Group,
  Text,
  Title,
  createStyles,
} from "@mantine/core";
import React from "react";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 80,
    height: "98vh",
    display: "grid",
    placeContent: "center",
  },

  label: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: 180,
    lineHeight: 1,
    marginBottom: theme.spacing.xl * 1.5,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[2],

    [theme.fn.smallerThan("sm")]: {
      fontSize: 120,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: "center",
    fontWeight: 900,
    fontSize: 32,

    [theme.fn.smallerThan("sm")]: {
      fontSize: 32,
    },
  },

  description: {
    maxWidth: 500,
    margin: "auto",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl * 1.5,
  },
}));

function Error({ error_type }) {
  const { classes } = useStyles();
  const navigate = useNavigate();

  return error_type === 404 ? (
    <Container className={classes.root}>
      <div className={classes.label}>404</div>
      <Title className={classes.title}>Vous avez trouvé un lieu secret.</Title>
      <Text
        color="dimmed"
        size="md"
        align="center"
        className={classes.description}
      >
        Malheureusement, il s'agit uniquement d'une page 404. Vous avez
        peut-être fait une erreur dans l'adresse, ou la page a été été déplacée
        vers une autre URL.
      </Text>
      <Group position="center">
        <Button
          variant="subtle"
          size="md"
          onClick={() => navigate("/auth/dashboard")}
        >
          Retourner à la page d'accueil
        </Button>
      </Group>
    </Container>
  ) : (
    <Container className={classes.root}>
      <div className={classes.label} style={{ color: "orange" }}>
        403
      </div>
      <Title className={classes.title}>Accès non-autorisé</Title>
      <Text
        color="dimmed"
        size="md"
        align="center"
        className={classes.description}
      >
        Malheureusement, vous ne disposez pas des privilèges suffisants pour
        accéder à cette page. Veuillez contacter votre administrateur pour plus
        d'informations.
      </Text>
      <Group position="center">
        <Button
          variant="subtle"
          size="md"
          onClick={() => navigate("/auth/dashboard")}
        >
          Retourner à la page d'accueil
        </Button>
      </Group>
    </Container>
  );
}

export default Error;
