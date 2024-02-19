import { Avatar, Card, Grid, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import {
  BsCheck2Circle,
  BsColumnsGap,
  BsFileLock,
  BsFillExclamationOctagonFill,
  BsFolder,
  BsFolder2Open,
  BsFolderCheck,
  BsFolderSymlink,
  BsFolderSymlinkFill,
  BsFolderX,
  BsInboxFill,
  BsPinMapFill,
  BsShieldLock,
  BsSquareFill,
} from "react-icons/bs";
import { FaLock } from "react-icons/fa";
import { useSelector } from "react-redux";
import FullPageLoader from "../../components/FullPageLoader/FullPageLoader";
import { _getDashboardReport } from "../../services/lib/report";
import DashboardAreaChart from "./AreaChart";
import DashboardBarChart from "./BarChart";
import DashboardPieChart from "./PieChart";
import DashboardSimplePieChart from "./SimplePieChart";
import "./dashboard.scss";

function Dashboard() {
  const loggedInUser = useSelector((state) => state.sessions.authUser);
  const [loading, setloading] = useState(true);
  const [data, setdata] = useState();

  useEffect(() => {
    const loadData = async () => {
      const res = await _getDashboardReport();

      if (res?.data) {
        setdata(res?.data);
        setloading(false);
      }
    };

    loadData();

    return () => {
      setdata(undefined);
    };
  }, []);

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <div style={{ padding: "6px 10px 6px 10px" }}>
      <Grid gutter="xs">
        <div className="headerMainPage">
          <p
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            <BsColumnsGap fontSize={18} style={{ marginRight: 8 }} /> Acceuil
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

      <Grid gutter="xs" style={{ marginBottom: -8 }}>
        <Grid.Col xs={12} sm={12} md={12} lg={12} xl={3}>
          <Grid gutter="xs">
            <Grid.Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Card>
                <div className="cardSpecs">
                  <div className="rightSectionSpecs">
                    <p>Cas signalés</p>
                    <h3>{loading ? "###" : data?.mainStats?.signaled}</h3>
                    <span style={{ marginBottom: -12 }}>
                      <BsCheck2Circle color="green" />
                      <p>
                        <b style={{ verticalAlign: "baseline" }}>
                          {loading
                            ? "###"
                            : parseInt(data?.mainStats?.confirmed)}{" "}
                          cas{" "}
                        </b>
                        declarés frauduleux
                      </p>
                    </span>
                    <span>
                      <BsFolderX color="red" />
                      <p>
                        <b style={{ verticalAlign: "baseline" }}>
                          {loading ? "###" : data?.mainStats?.dismissed} cas{" "}
                        </b>
                        declarés non-frauduleux
                      </p>
                    </span>
                  </div>
                  <Avatar color="orange" size={52} radius="xl">
                    <BsFillExclamationOctagonFill size={24} />
                  </Avatar>
                </div>
              </Card>
            </Grid.Col>

            <Grid.Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Card>
                <div className="cardSpecs">
                  <div className="rightSectionSpecs">
                    <p>Total dossiers pris en charge</p>
                    <h3>
                      {loading ? "###" : parseInt(data?.mainStats?.confirmed)}
                    </h3>
                    <span style={{ marginBottom: -12 }}>
                      <BsFolderSymlinkFill color="cyan" />
                      <p>
                        <b style={{ verticalAlign: "baseline" }}>
                          {loading ? "###" : data?.mainStats?.transferred}{" "}
                          transfers direct{" "}
                        </b>
                        à la CNLFM/Provinciale
                      </p>
                    </span>
                    <span style={{ marginBottom: -12 }}>
                      <BsFolderSymlinkFill color="cyan" />
                      <p>
                        <b style={{ verticalAlign: "baseline" }}>
                          {loading
                            ? "###"
                            : data?.mainStats?.contested_transfer}{" "}
                          transfers{" "}
                        </b>
                        à la CNLFM aprés contestation sur site
                      </p>
                    </span>
                    <span>
                      <BsFolderSymlinkFill color="green" />
                      <p>
                        <b style={{ verticalAlign: "baseline" }}>
                          {loading
                            ? "###"
                            : parseInt(data?.mainStats?.closed_insito)}{" "}
                          dossiers{" "}
                        </b>
                        instruit et cloturé sur site
                      </p>
                    </span>
                  </div>
                  <Avatar color="green" size={52} radius="xl">
                    <BsFolder2Open size={24} />
                  </Avatar>
                </div>
              </Card>
            </Grid.Col>

            <Grid.Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Card>
                <div className="cardSpecs">
                  <div className="rightSectionSpecs">
                    <p>Dossiers soumis à l'instruction</p>
                    <h3>
                      {loading ? "###" : parseInt(data?.mainStats?.confirmed)}
                    </h3>
                    <span style={{ marginBottom: -12 }}>
                      <BsInboxFill color="gray" />
                      <p>
                        <b style={{ verticalAlign: "baseline" }}>
                          {loading
                            ? "###"
                            : parseInt(data?.mainStats?.confirmed) -
                              (parseInt(data?.mainStats?.concluded) +
                                parseInt(
                                  data?.mainStats?.concluded_insito
                                ))}{" "}
                          dossiers{" "}
                        </b>
                        sont en cours
                      </p>
                    </span>
                    <span>
                      <FaLock color="green" />
                      <p>
                        <b style={{ verticalAlign: "baseline" }}>
                          {loading
                            ? "###"
                            : parseInt(data?.mainStats?.concluded) +
                              parseInt(data?.mainStats?.concluded_insito)}{" "}
                          dossiers{" "}
                        </b>
                        sont cloturés
                      </p>
                    </span>
                  </div>
                  <Avatar color="green" size={52} radius="xl">
                    <FaLock size={24} />
                  </Avatar>
                </div>
              </Card>
            </Grid.Col>

            <Grid.Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Card>
                <div className="cardSpecs">
                  <div className="rightSectionSpecs">
                    <p>Décision de la CNLFM</p>
                    <h3>
                      {loading
                        ? "###"
                        : parseInt(data?.mainStats?.concluded) +
                          parseInt(data?.mainStats?.concluded_insito)}
                    </h3>
                    {loading
                      ? "#####"
                      : data?.conclusionStats?.map((o, i) => (
                          <span
                            key={o._id}
                            style={{
                              marginBottom:
                                i !== data?.conclusionStats.length - 1
                                  ? -12
                                  : null,
                            }}
                          >
                            <BsFolderSymlinkFill color="dodgerblue" />
                            <p>
                              <b style={{ verticalAlign: "baseline" }}>
                                {o.total}{" "}
                              </b>
                              {o._id}
                            </p>
                          </span>
                        ))}
                  </div>
                  <Avatar color="cyan" size={52} radius="xl">
                    <BsFolder size={24} />
                  </Avatar>
                </div>
              </Card>
            </Grid.Col>

            <Grid.Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Card>
                <div className="cardSpecs">
                  <div className="rightSectionSpecs">
                    <p>Niveau d'execution de la décision</p>
                    <h3>
                      {loading
                        ? "###"
                        : parseInt(data?.mainStats?.concluded) +
                          parseInt(data?.mainStats?.concluded_insito)}
                    </h3>
                    <span style={{ marginBottom: -12 }}>
                      <BsFolderCheck color="gray" />
                      <p>
                        <b style={{ verticalAlign: "baseline" }}>
                          {loading
                            ? "###"
                            : parseInt(data?.mainStats?.executed)}{" "}
                          décisions{" "}
                        </b>
                        executés
                      </p>
                    </span>
                    <span>
                      <FaLock color="green" />
                      <p>
                        <b style={{ verticalAlign: "baseline" }}>
                          {loading
                            ? "###"
                            : parseInt(data?.mainStats?.concluded) +
                              parseInt(data?.mainStats?.concluded_insito) -
                              parseInt(data?.mainStats?.executed)}{" "}
                          décisions{" "}
                        </b>
                        en attente d'éxécution
                      </p>
                    </span>
                  </div>
                  <Avatar color="green" size={52} radius="xl">
                    <BsFolderCheck size={24} />
                  </Avatar>
                </div>
              </Card>
            </Grid.Col>

            <Grid.Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Card>
                <div className="cardSpecs">
                  <div className="rightSectionSpecs">
                    <p>Dossiers en appel</p>
                    <h3>
                      {loading
                        ? "###"
                        : parseInt(data?.mainStats?.appel_first) +
                          parseInt(data?.mainStats?.appel_second)}
                    </h3>
                    <span style={{ marginBottom: -12 }}>
                      <BsFolderSymlink color="gray" />
                      <p>
                        <b style={{ verticalAlign: "baseline" }}>
                          {loading
                            ? "###"
                            : parseInt(data?.mainStats?.appel_first)}{" "}
                          cas{" "}
                        </b>
                        soumis en appel 1er degré
                      </p>
                    </span>
                    <span>
                      <FaLock color="green" />
                      <p>
                        <b style={{ verticalAlign: "baseline" }}>
                          {loading
                            ? "###"
                            : parseInt(data?.mainStats?.appel_second)}{" "}
                          cas{" "}
                        </b>
                        soumis en appel 2nd degré
                      </p>
                    </span>
                  </div>
                  <Avatar color="green" size={52} radius="xl">
                    <BsFolderSymlinkFill size={24} />
                  </Avatar>
                </div>
              </Card>
            </Grid.Col>

            <Grid.Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Card>
                <div className="cardSpecs">
                  <div className="rightSectionSpecs">
                    <p>Cloture définitive des dossiers</p>
                    <h3>
                      {loading ? "###" : parseInt(data?.mainStats?.archived)}
                    </h3>
                    <span style={{ marginBottom: -12 }}>
                      <BsFileLock color="gray" />
                      <p>
                        <b style={{ verticalAlign: "baseline" }}>
                          {loading
                            ? "###"
                            : parseInt(data?.mainStats?.closed_insito)}{" "}
                          clotures{" "}
                        </b>
                        sur site aprés instruction provisoire
                      </p>
                    </span>
                    <span style={{ marginBottom: -12 }}>
                      <FaLock color="green" />
                      <p>
                        <b style={{ verticalAlign: "baseline" }}>
                          {loading
                            ? "###"
                            : parseInt(data?.mainStats?.closed_by_cnlfm)}{" "}
                          cloturés{" "}
                        </b>
                        aprés instruction CNLFM/Provinciale
                      </p>
                    </span>
                    <span>
                      <FaLock color="green" />
                      <p>
                        <b style={{ verticalAlign: "baseline" }}>
                          {loading
                            ? "###"
                            : parseInt(
                                data?.mainStats?.closed_after_appel
                              )}{" "}
                          cloturés{" "}
                        </b>
                        aprés fixation
                      </p>
                    </span>
                  </div>
                  <Avatar color="red" size={52} radius="xl">
                    <BsShieldLock size={24} />
                  </Avatar>
                </div>
              </Card>
            </Grid.Col>
          </Grid>
        </Grid.Col>

        <Grid.Col xs={12} sm={12} md={12} lg={12} xl={9}>
          <Grid gutter="xs" style={{ marginBottom: 4 }}>
            <Grid.Col xs={12} sm={12} md={12} lg={12} xl={6}>
              <Card>
                <h3 className="cardTitle">
                  Fréquences des substances par rapport aux cas
                </h3>
                <div
                  style={{ width: "100%", height: 300 }}
                  className="piechart_gender"
                >
                  <div className="chart">
                    <DashboardSimplePieChart data={data?.substancesStats} />
                  </div>
                  <div className="right_data">
                    {data?.substancesStats?.map((data) => (
                      <div className="instruction_data" key={data?._id}>
                        <span>
                          <BsSquareFill
                            color={data.color}
                            size={14}
                            style={{ marginRight: 8 }}
                          />{" "}
                          {data._id} <b>({data.total})</b>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <p
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 45,
                    fontSize: 16,
                    color: "#a6a6a6",
                  }}
                >
                  {new Date().getFullYear() - 1}-{new Date().getFullYear()}
                </p>
              </Card>
            </Grid.Col>

            <Grid.Col xs={12} sm={12} md={12} lg={12} xl={6}>
              <Card>
                <h3 className="cardTitle">Dossiers orientés vers</h3>
                <div
                  style={{ width: "100%", height: 300 }}
                  className="piechart_gender"
                >
                  <div className="chart">
                    <DashboardPieChart data={data?.orientationStats} />
                  </div>
                  <div className="center_data">
                    <h4>{data?.mainStats?.oriented}</h4>
                    <p>dossiers cette année</p>
                  </div>
                  <div className="right_data">
                    {data?.orientationStats.map((data) => (
                      <div className="instruction_data" key={data?._id}>
                        <span>
                          <BsSquareFill
                            color={data.color}
                            size={14}
                            style={{ marginRight: 8 }}
                          />{" "}
                          {data._id} <b>({data.total})</b>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <p
                  style={{
                    position: "absolute",
                    top: 22,
                    right: 45,
                    fontSize: 16,
                    color: "#a6a6a6",
                  }}
                >
                  {new Date().getFullYear() - 1}-{new Date().getFullYear()}
                </p>
              </Card>
            </Grid.Col>
          </Grid>

          <Grid gutter="xs" style={{ marginBottom: 4 }}>
            <Grid.Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Card className="cardStyle" style={{ position: "relative" }}>
                <h3 className="cardTitle">
                  Activités ({loading ? "###" : data?.mainStats?.signaled})
                </h3>
                <div style={{ width: "100%", height: 512 }}>
                  <DashboardAreaChart data={data?.year_activities} />
                </div>
                <p
                  style={{
                    position: "absolute",
                    top: 65,
                    right: 45,
                    fontSize: 16,
                    color: "#a6a6a6",
                  }}
                >
                  {new Date().getFullYear() - 1}-{new Date().getFullYear()}
                </p>
              </Card>
            </Grid.Col>
          </Grid>

          <Grid gutter="xs" style={{ marginBottom: 4 }}>
            <Grid.Col xs={12} sm={12} md={12} lg={12} xl={6}>
              <Card>
                <h3 className="cardTitle">
                  Fréquence des presumés fraudeur selon leur genre
                </h3>
                <div
                  style={{ width: "100%", height: 300 }}
                  className="piechart_gender"
                >
                  <div className="chart">
                    <DashboardPieChart data={data?.genderRatio} />
                  </div>
                  <div className="center_data">
                    <h4>
                      {parseInt(data?.genderRatio[0].total) +
                        parseInt(data?.genderRatio[1].total)}
                    </h4>
                    <p>presumés fraudeurs</p>
                  </div>
                  <div className="right_data">
                    {data?.genderRatio.map((data) => (
                      <div className="instruction_data" key={data?._id}>
                        <span>
                          <BsSquareFill
                            color={data.color}
                            size={14}
                            style={{ marginRight: 8 }}
                          />{" "}
                          {data._id} <b>({data.total})</b>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <p
                  style={{
                    position: "absolute",
                    top: 22,
                    right: 45,
                    fontSize: 16,
                    color: "#a6a6a6",
                  }}
                >
                  {new Date().getFullYear() - 1}-{new Date().getFullYear()}
                </p>
              </Card>
            </Grid.Col>
            <Grid.Col xs={12} sm={12} md={12} lg={12} xl={6}>
              <Card>
                <h3 className="cardTitle">
                  Fréquence des conditionnements des substances
                </h3>
                <div
                  style={{ width: "100%", height: 300 }}
                  className="piechart_gender"
                >
                  <div className="chart">
                    <DashboardSimplePieChart data={data?.container} />
                  </div>
                  <div className="right_data">
                    {data?.container?.map((data) => (
                      <div className="instruction_data" key={data?._id}>
                        <span>
                          <BsSquareFill
                            color={data.color}
                            size={14}
                            style={{ marginRight: 8 }}
                          />{" "}
                          {data._id} <b>({data.total})</b>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <p
                  style={{
                    position: "absolute",
                    top: 22,
                    right: 45,
                    fontSize: 16,
                    color: "#a6a6a6",
                  }}
                >
                  {new Date().getFullYear() - 1}-{new Date().getFullYear()}
                </p>
              </Card>
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
      <Grid gutter="xs">
        <Grid.Col span={12}>
          <Card>
            <h3 className="cardTitle">Services aviseurs</h3>
            <div
              style={{
                width: "100%",
                height: 250,
              }}
            >
              {data?.serviceStatCases?.length === 0 ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "grid",
                    placeContent: "center",
                  }}
                >
                  <Text size="sm" color="dimmed">
                    Aucun service enregistré
                  </Text>
                </div>
              ) : (
                <DashboardBarChart
                  data={data?.serviceStatCases}
                  dataKey="cases"
                />
              )}
            </div>
            <p
              style={{
                position: "absolute",
                top: 22,
                right: 45,
                fontSize: 16,
                color: "#a6a6a6",
              }}
            >
              {new Date().getFullYear() - 1}-{new Date().getFullYear()}
            </p>
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
}

export default Dashboard;
