/* eslint-disable no-unused-vars */
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Grid,
  Group,
  ScrollArea,
  Table,
  Text,
  UnstyledButton,
  createStyles,
} from "@mantine/core";
import { DateRangePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import React, { useRef, useState } from "react";
import {
  BsArrowRight,
  BsExclamationOctagon,
  BsFileEarmarkCheckFill,
  BsFilePdf,
  BsFolder,
  BsInboxFill,
  BsPinMapFill,
} from "react-icons/bs";
import { useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import FullPageLoader from "../../components/FullPageLoader/FullPageLoader";
import PrintHeader from "../../components/PrintHeader";
import { _getQueryReport } from "../../services/lib/report";
import "./reports.scss";

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.xs}px`,

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

function Reports() {
  const loggedInUser = useSelector((state) => state.sessions.authUser);
  const [sortedData, setSortedData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [selectedData, setselectedData] = useState();
  // const [queriedData, setQueriedData] = useState([]);
  const form = useForm({
    date_range: (value) => (value.length === 0 ? "Date cannot be empty" : null),
  });

  const componentRef = useRef();

  function adjust(date) {
    const myDate = new Date(date);
    myDate.setDate(myDate.getDate() + parseInt(1));
    return myDate.toISOString();
  }

  function handleSubmit() {
    setIsLoading(true);
    const range = form.values?.date_range;

    if (!range) {
      setIsLoading(false);
      showNotification({
        color: "orange",
        title: "Warning",
        message: "Date cannot be empty",
        icon: <BsExclamationOctagon />,
      });
    } else {
      const start_date = range[0]?.toISOString();
      const end_date = adjust(range[1]);

      setselectedData({ start_date: range[0], end_date: range[1] });

      const eventsFetch = async function () {
        const res = await _getQueryReport({ start_date, end_date });
        if (res?.data) {
          console.log("Loading orders report...", res?.data);
          setSortedData(res?.data);
          // setQueriedData(res?.data);
          setIsLoading(false);
        } else {
          setSortedData([]);
          setIsLoading(false);
        }
      };

      eventsFetch();
    }
  }

  const parseNumber = (value) => {
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const rows = sortedData.map((row) => (
    <tr key={row._id} style={{ cursor: "pointer" }}>
      {/* Date & status */}
      <td>
        <div style={{ display: "inline-flex", alignItems: "center" }}>
          <BsFolder size={24} />
          <div
            style={{
              marginLeft: 14,
              fontSize: 12,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Text weight={400} size="xs">
              {new Date(row?.createdAt).toLocaleString("vh").substring(0, 10)}
            </Text>
            <span>{row?.code}</span>
          </div>
        </div>
      </td>

      {/* assigned agents */}
      <td style={{ padding: 0 }}>
        <table style={{ verticalAlign: "middle" }}>
          <thead>
            <tr style={{ pading: 0 }}>
              <th style={{ fontSize: 12, padding: 2, width: "12%" }}>Colis</th>
              <th style={{ fontSize: 12, padding: 2, width: "30%" }}>Nature</th>
              <th style={{ fontSize: 12, padding: 2, width: "18%" }}>Poids</th>
              <th style={{ fontSize: 12, padding: 2, width: "30%" }}>
                Consignation
              </th>
            </tr>
          </thead>
          <tbody>
            {row?.substances?.length > 0 ? (
              row?.substances.map((e) => (
                <tr style={{ pading: 0 }} key={e._id}>
                  <td
                    style={{
                      fontSize: 12,
                      padding: 2,
                      textAlign: "right",
                      fontWeight: 600,
                    }}
                  >
                    ({parseNumber(e.colis)})
                  </td>
                  <td style={{ fontSize: 12, padding: 2 }}>{e.nature}</td>
                  <td style={{ fontSize: 12, padding: 2, fontWeight: 600 }}>
                    {e.weight}
                    {e.unit}
                  </td>
                  <td style={{ fontSize: 12, padding: 2 }}>{e.consignation}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>
                  <Text size="xs" weight={400} align="center">
                    Aucune donnée
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </td>

      <td>
        <Text weight={400} size="xs">
          {row?.signalement.arrest_location?.toUpperCase()}
        </Text>
      </td>

      <td>
        <Text weight={800} size="xs">
          {row?.orientation?.classification}
        </Text>
        <Text weight={400} size="xs" color="blue">
          {row?.orientation?.instruction}
        </Text>
      </td>

      <td>
        <Badge
          size="xs"
          variant="outline"
          color={
            row?.status === "signal"
              ? "red"
              : row?.status === "sans-suite"
              ? "gray"
              : row?.status === "confirmed"
              ? "blue"
              : row?.status === "transferred"
              ? "blue"
              : row?.status === "oriented"
              ? "blue"
              : "green"
          }
          radius="sm"
        >
          {row?.status === "signal"
            ? "en attente"
            : row?.status === "sans-suite"
            ? "sans suite"
            : row?.status === "confirmed"
            ? "en cours de traitement"
            : row?.status === "transferred"
            ? "en cours de traitement"
            : row?.status === "oriented"
            ? "en cours de traitement"
            : "cloturé"}
        </Badge>
        <Text weight={400} size="xs">
          {row?.conclusion.no_decision}
        </Text>
      </td>
    </tr>
  ));

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
            <BsFileEarmarkCheckFill fontSize={18} style={{ marginRight: 8 }} />{" "}
            Rapport
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
              <Grid.Col span={12}>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <div
                    style={{
                      width: "100%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "end",
                    }}
                  >
                    {/* <TextInput
                                placeholder="Search by any field"
                                variant="filled" 
                                icon={<BsSearch size={14} />}
                                value={search}
                                onChange={handleSearchChange}
                                style={{width: 300}}
                            /> */}
                    <div
                      style={{ display: "inline-flex", alignItems: "center" }}
                    >
                      <DateRangePicker
                        variant="filled"
                        required
                        style={{ width: 310, marginRight: 12 }}
                        {...form.getInputProps("date_range")}
                        rightSection={
                          <ActionIcon
                            type="submit"
                            variant="filled"
                            loading={isLoading}
                            color="blue"
                          >
                            <BsArrowRight />
                          </ActionIcon>
                        }
                      />

                      <ReactToPrint
                        onBeforePrint={() => console.log("Before printing")}
                        onAfterPrint={() => console.log("After print")}
                        trigger={() => (
                          <Button variant="filled" leftIcon={<BsFilePdf />}>
                            Export to PDF
                          </Button>
                        )}
                        content={() => componentRef.current}
                      />
                    </div>
                  </div>
                </form>
              </Grid.Col>

              <Grid.Col span={12} style={{ minHeight: 500 }}>
                <ScrollArea ref={componentRef}>
                  <PrintHeader />
                  {selectedData ? (
                    <Text
                      weight={600}
                      size="md"
                      tt="uppercase"
                      underline
                      style={{ textAlign: "center" }}
                      color="red"
                    >
                      {`Tableau condensé des cas de fraude minière enregistrés au cours de la periode du ${new Date(
                        selectedData?.start_date
                      )
                        .toLocaleString()
                        .substring(0, 10)} au ${new Date(selectedData?.end_date)
                        .toLocaleString()
                        .substring(0, 10)}`?.toLocaleUpperCase()}
                    </Text>
                  ) : null}

                  <Table
                    mt={14}
                    highlightOnHover
                    horizontalSpacing="md"
                    verticalSpacing="xs"
                    sx={{ tableLayout: "fixed", minWidth: 700 }}
                  >
                    <colgroup>
                      <col span="1" style={{ width: "12%" }} />
                      <col span="1" style={{ width: "36%" }} />
                      <col span="1" style={{ width: "12%" }} />
                      <col span="1" style={{ width: "18%" }} />
                      <col span="1" style={{ width: "18%" }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <Th>Date & ID</Th>
                        <Th>Substances</Th>
                        <Th>Lieu de saisie</Th>
                        <Th>Classification & Orientation</Th>
                        <Th>Observation</Th>
                      </tr>
                    </thead>
                    {isLoading ? (
                      <tbody>
                        <tr>
                          <td colSpan={6} style={{ height: 120 }}>
                            <FullPageLoader />
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody>
                        {rows.length > 0 ? (
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
    </div>
  );
}

export default Reports;
