/* eslint-disable react-hooks/exhaustive-deps */
import {
  Divider,
  Grid,
  Group,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
  createStyles,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { BsInboxFill, BsInfoLg, BsSearch } from "react-icons/bs";
import { useSelector } from "react-redux";
import FullPageLoader from "../../components/FullPageLoader/FullPageLoader";
import { LoadAgents } from "../../hooks/fetchAgent";

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
  const keys = ["code", "name"];
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys.some((key) => item[key].toLowerCase().includes(query))
  );
}

function DisplayAviseur() {
  const [search, setSearch] = useState("");
  const agentsState = useSelector((state) => state.agents);

  const userPermissions = useSelector(
    (state) => state.sessions.authUser
  ).permissions;

  const [loading, agents] = LoadAgents();

  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    setSortedData(agentsState);
    return () => {
      setSortedData([]);
    };
  }, [agentsState, agents]);

  const rows = sortedData
    ?.slice(0)
    .reverse()
    .map((row) => (
      <tr
        key={row._id}
        style={{
          cursor: "pointer",
        }}
      >
        {/* Date & status */}
        <td>
          <div style={{ display: "inline-flex", alignItems: "center" }}>
            <Text>
              <BsInfoLg
                size={18}
                style={{ marginBottom: -4, marginRight: 14 }}
              />
              {row.code?.toUpperCase()}
            </Text>
          </div>
        </td>

        <td>
          <Text weight={400} size="sm">
            {row.name?.toUpperCase()}
          </Text>
        </td>

        <td>
          <Text weight={800} size="sm">
            {row?.phone}
          </Text>
        </td>

        <td>
          <Text weight={800} size="sm">
            signalé au {row?.service.service_name}
          </Text>
        </td>
      </tr>
    ));

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(filterData(agents, value));
  };

  return (
    <div>
      <Grid>
        <Grid.Col span={12} style={{ minHeight: 500 }}>
          {userPermissions?.READ_ADVISOR_INFO ? (
            <ScrollArea>
              <div
                style={{
                  width: "100%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span></span>
                <TextInput
                  placeholder="Rechercher aviseur..."
                  variant="filled"
                  icon={<BsSearch size={14} />}
                  value={search}
                  onChange={handleSearchChange}
                  style={{ width: 320 }}
                />
              </div>
              <Divider style={{ marginBlock: 12 }} />
              <Table
                highlightOnHover
                horizontalSpacing="md"
                verticalSpacing="xs"
                sx={{ tableLayout: "fixed", minWidth: 700 }}
              >
                <colgroup>
                  <col span="1" style={{ width: "14%" }} />
                  <col span="1" style={{ width: "36%" }} />
                  <col span="1" style={{ width: "20%" }} />
                  <col span="1" style={{ width: "30%" }} />
                </colgroup>

                <thead>
                  <tr>
                    <Th>Code</Th>
                    <Th>Noms</Th>
                    <Th>Telephone</Th>
                    <Th>Service avisé</Th>
                  </tr>
                </thead>
                {loading ? (
                  <tbody>
                    <tr>
                      <td colSpan={4} style={{ height: 120 }}>
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
                        <td colSpan={4}>
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
                            <Text weight={500} color="#cacaca" align="center">
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
          ) : null}
        </Grid.Col>
      </Grid>
    </div>
  );
}

export default DisplayAviseur;
