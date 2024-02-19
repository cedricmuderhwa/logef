/* eslint-disable react-hooks/exhaustive-deps */
import {
  Card,
  Divider,
  Grid,
  Group,
  Modal,
  ScrollArea,
  Table,
  Text,
  TextInput,
  Title,
  UnstyledButton,
  createStyles,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import {
  BsInboxFill,
  BsPersonBadgeFill,
  BsPinMapFill,
  BsSearch,
} from "react-icons/bs";
import { useSelector } from "react-redux";
import FormFraudeur from "../../components/FormFraudeur";
import FullPageLoader from "../../components/FullPageLoader/FullPageLoader";
import { LoadFraudeurs } from "../../hooks/fetchFraudeur";

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `4px`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: "auto",
    height: "auto",
    borderRadius: 21,
  },
}));

function Th({ children, onSort }) {
  const { classes } = useStyles();

  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={400} size="sm">
            {children}
          </Text>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data, search) {
  const keys = ["nom", "postnom", "prenom"];
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys.some((key) => item[key].toLowerCase().includes(query))
  );
}

function Negociant() {
  const [search, setSearch] = useState("");
  const negociants = useSelector((state) => state.fraudeurs);
  const loggedInUser = useSelector((state) => state.sessions.authUser);
  const [sortedData, setSortedData] = useState([]);
  const [loading, fraudeurs] = LoadFraudeurs();
  const [createVisible, setcreateVisible] = useState(false);

  useEffect(() => {
    setSortedData(negociants);
    return () => {
      setSortedData([]);
    };
  }, [fraudeurs, negociants]);

  const rows = sortedData.map((row) => (
    <tr
      key={row._id}
      style={{
        cursor: "pointer",
        backgroundColor:
          row?.forfaits === 0
            ? "#00ff0018"
            : row?.forfaits === 1
            ? "rgba(248, 214, 44, 0.45)"
            : "rgba(255, 0, 0, 0.15)",
      }}
    >
      {/* Date & status */}
      <td>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <Text>
            <BsPersonBadgeFill
              size={18}
              style={{ marginBottom: -4, marginRight: 14 }}
            />
            {row.nom?.concat(" ", row.postnom, " ", row.prenom)?.toUpperCase()}
          </Text>
          <Text size="xs" color="blue" pl={32}>
            [{row?.casesList?.join(", ")}]
          </Text>
        </div>
      </td>

      <td>
        <Text weight={400} size="xs">
          {row?.gender === "male"
            ? "Homme"
            : row?.gender === "female"
            ? "Femme"
            : "Mineur"}
        </Text>
      </td>

      <td>
        <Text weight={800} size="xs">
          {row?.nationalite}
        </Text>
      </td>

      <td>
        <Text weight={400} size="xs" color="blue">
          ({row?.forfaits}) apparution(s) dans la fraude
        </Text>
      </td>

      <td>
        <Text weight={400} size="xs">
          {row?.region?.region}
        </Text>
      </td>
    </tr>
  ));

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(filterData(negociants, value));
  };

  return (
    <div style={{ padding: "8px 14px 8px 14px" }}>
      <Grid gutter="sm">
        <div className="headerMainPage">
          <p
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            <BsPersonBadgeFill fontSize={18} style={{ marginRight: 8 }} />{" "}
            Négociant
          </p>
          <span className="rightSection">
            <Text size="xs" color="blue">
              <BsPinMapFill
                size={18}
                style={{ marginBottom: -4, marginRight: 8 }}
              />
              {loggedInUser?.region?.region}
            </Text>
          </span>
        </div>
      </Grid>
      <Grid gutter="sm">
        <Grid.Col span={12}>
          <Card>
            <Grid>
              <Grid.Col span={12} style={{ minHeight: 500 }}>
                <ScrollArea>
                  <div
                    style={{
                      width: "100%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* <Button leftIcon={<BsPersonPlus size={20} />} onClick={() => setcreateVisible(true)} color="blue" style={{marginRight: 14}}>Nouveau negociant</Button> */}
                    <span></span>
                    <TextInput
                      placeholder="Rechercher négociant..."
                      variant="filled"
                      icon={<BsSearch size={14} />}
                      value={search}
                      onChange={handleSearchChange}
                      style={{ width: 320 }}
                    />
                  </div>
                  <Divider style={{ marginBlock: 14 }} />
                  <Table
                    mt={14}
                    highlightOnHover
                    horizontalSpacing="md"
                    verticalSpacing="xs"
                    sx={{ tableLayout: "fixed", minWidth: 700 }}
                  >
                    <colgroup>
                      <col span="1" style={{ width: "36%" }} />
                      <col span="1" style={{ width: "12%" }} />
                      <col span="1" style={{ width: "12%" }} />
                      <col span="1" style={{ width: "18%" }} />
                      <col span="1" style={{ width: "18%" }} />
                    </colgroup>

                    <thead>
                      <tr>
                        <Th>Noms</Th>
                        <Th>Genre/Category</Th>
                        <Th>Nationalité</Th>
                        <Th>Fortfaits</Th>
                        <Th>Région</Th>
                      </tr>
                    </thead>
                    {loading ? (
                      <tbody>
                        <tr>
                          <td colSpan={6} style={{ height: 120 }}>
                            <FullPageLoader />
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody>
                        {rows?.length > 0 ? (
                          rows
                        ) : (
                          <tr>
                            <td colSpan={6}>
                              <div
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  alignSelf: "center",
                                  padding: 120,
                                }}
                              >
                                <BsInboxFill size={120} color="#eaeaea" />

                                <Text
                                  weight={500}
                                  color="#cacaca"
                                  align="center"
                                >
                                  Aucune donnée
                                </Text>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    )}
                  </Table>
                </ScrollArea>
              </Grid.Col>
            </Grid>
          </Card>
        </Grid.Col>
      </Grid>

      <Modal
        overlayOpacity={0.5}
        opened={createVisible}
        onClose={() => setcreateVisible(false)}
        title={
          <Title
            order={4}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "600",
              color: "dodgerblue",
            }}
          >
            <BsPersonBadgeFill size={18} style={{ marginRight: 8 }} /> Nouveau
            negociant
          </Title>
        }
      >
        <FormFraudeur
          status="negociant"
          handleClose={() => {
            setcreateVisible(false);
          }}
        />
      </Modal>
    </div>
  );
}

export default Negociant;
