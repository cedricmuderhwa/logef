import {
  Alert,
  Avatar,
  Button,
  Card,
  Divider,
  Grid,
  List,
  Modal,
  Text,
  Timeline,
  Title,
} from "@mantine/core";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  BsCalendar2,
  BsCheck2,
  BsExclamationCircle,
  BsFilesAlt,
  BsFolderFill,
  BsLink45Deg,
  BsPersonBadge,
  BsPlusLg,
  BsTruck,
  BsUpload,
  BsX,
} from "react-icons/bs";
import { FaBullhorn, FaUserCog } from "react-icons/fa";
import { GiMinerals } from "react-icons/gi";
import { useSelector } from "react-redux";
import { LoadFraudeurs } from "../../hooks/fetchFraudeur";
import FormInvitation from "../FormInvitation";
import FormMoyen from "../FormMoyen";
import FormPv from "../FormPV";
import FormPrevenu from "../FormPrevenu";
import FormSubstance from "../FormSubstance";
import FullPageLoader from "../FullPageLoader/FullPageLoader";
import "./displayfraudcase.scss";

function DisplayFraudCase() {
  const [substance, setsubstance] = useState(false);
  const frauds = useSelector((state) => state.fraud_cases);
  const current = useSelector((state) => state.current);
  const userPermissions = useSelector(
    (state) => state.sessions.authUser
  ).permissions;

  const [data, setdata] = useState();

  LoadFraudeurs();

  const [pvsTC, setpvsTC] = useState(false);
  const [pvsIN, setpvsIN] = useState(false);
  const [pvsEx, setpvsEx] = useState(false);
  const [prevenu, setprevenu] = useState(false);
  const [moyen, setmoyen] = useState(false);
  const [invitation, setinvitation] = useState(false);
  const [alert, setalert] = useState(false);
  const [invite, setinvite] = useState(false);

  useEffect(() => {
    setdata(current);
    var today = moment();

    const meet = current?.meeting;

    var meetDate = moment(new Date(meet?.date_meeting), "YYYY-MM-DD");

    if (current?.meeting && meetDate.isAfter(today)) {
      setalert(true);
    } else {
      setalert(false);
    }

    return () => {
      setdata(undefined);
      setalert(false);
    };
  }, [frauds, current]);

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  if (!data) {
    return <FullPageLoader />;
  }

  const parseNumber = (value) => {
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div
      style={{
        borderTop: "1px solid #eaeaea",
        marginTop: -10,
        height: "100vh",
        overflowX: "hidden",
        overflowY: "scroll",
        paddingBottom: 42,
        backgroundColor: "rgba(234, 234, 234, .3)",
      }}
    >
      <Grid style={{ padding: "7px" }} gutter="xs">
        <Grid.Col xs={12} sm={12} md={4} lg={4} xl={3}>
          <Card style={{ padding: 14 }}>
            <Grid justify="space-evenly">
              {alert ? (
                <Alert
                  icon={<BsExclamationCircle size={24} />}
                  title="Invitation"
                  color="orange"
                  style={{ marginBottom: 14 }}
                  withCloseButton
                  onClose={() => setalert(false)}
                >
                  <Text size="xs">
                    La prochaine réunion est prévue en date du{" "}
                    {new Date(data?.meeting.date_meeting)
                      .toLocaleString("vh")
                      .substring(0, 10)}{" "}
                    à partir de{" "}
                    {new Date(data?.meeting.time_meeting)
                      .toLocaleString("vh")
                      .substring(11, 17)}
                    , au {data?.meeting.location}. La présence de{" "}
                    {data?.meeting.service?.join(", ")} est vivement souhaitée.
                  </Text>
                </Alert>
              ) : null}
              <Grid.Col
                span={12}
                style={{
                  backgroundColor:
                    data?.status === "irregular" ? "#000" : "dodgerblue",
                  borderRadius: 8,
                  padding: 14,
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <Avatar
                  size={68}
                  color={data?.status === "irregular" ? "orange" : "blue"}
                >
                  <BsFolderFill size={42} />
                </Avatar>
                <div className="fraud-case-data">
                  <h3>{data?.code}</h3>
                  <Text size="xs" style={{ marginTop: 2 }}>
                    <BsCalendar2
                      size={16}
                      style={{ marginBottom: -3, marginRight: 6 }}
                    />{" "}
                    {new Date(data?.createdAt)
                      .toLocaleString("vh")
                      .substring(0, 17)}
                  </Text>
                  {/* <Text size='xs' ><FaUserCog size={16} style={{marginBottom: -3, marginRight: 6}} /> {data?.signalement?.service?.service_name?.replace(/.(?=.{0})/g, '#')}</Text> */}
                  {userPermissions?.READ_SENSITIVE_DATA ? (
                    <Text size="xs">
                      <FaUserCog
                        size={16}
                        style={{ marginBottom: -3, marginRight: 6 }}
                      />{" "}
                      {data?.signalement?.service?.service_name}
                    </Text>
                  ) : null}
                </div>
              </Grid.Col>
              <Grid.Col span={12}>
                {userPermissions?.READ_SENSITIVE_DATA ? (
                  <div className="data-section">
                    <Text size="xs" color="dimmed">
                      Personne(s) aviseur
                    </Text>
                    {/* <Text size='xs' weight={600}>{data?.signalement?.agent?.replace(/.(?=.{0})/g, '#')}</Text> */}
                    <Text size="xs" weight={600}>
                      {data?.signalement?.agent}
                    </Text>
                  </div>
                ) : null}
                <div className="data-section">
                  <Text size="xs" color="dimmed">
                    Lieu de constat
                  </Text>
                  <Text size="xs" weight={600}>
                    {data?.signalement?.arrest_location}
                  </Text>
                </div>
                <div className="data-section">
                  <Text size="xs" color="dimmed">
                    Site de provenance
                  </Text>
                  <Text size="xs" weight={600}>
                    {data?.signalement?.provenance}
                  </Text>
                </div>
                <div className="data-section">
                  <Text size="xs" color="dimmed">
                    Déstination
                  </Text>
                  <Text size="xs" weight={600}>
                    {data?.signalement?.destination}
                  </Text>
                </div>
              </Grid.Col>
              <Grid.Col span={12} style={{ marginTop: -8 }}>
                <div>
                  <Text size="sm" weight={600} style={{ marginBottom: 4 }}>
                    Observation :
                  </Text>
                  <Text size="xs" color="dimmed" italic>
                    {data?.signalement?.observation}
                  </Text>
                </div>
              </Grid.Col>
              {data?.orientation?.isComplete ? (
                <Grid.Col
                  span={12}
                  style={{
                    backgroundColor: "rgba(64, 194, 255, 0.02)",
                    border: "1px solid #eaeaea",
                    borderRadius: 8,
                    padding: "10px 14px",
                  }}
                >
                  <div className="data-section">
                    <Text size="xs" color="dimmed">
                      Categorisation du cas
                    </Text>
                    <Text size="sm" weight={600}>
                      {data?.orientation?.classification}
                    </Text>
                  </div>
                  <div className="data-section">
                    <Text size="xs" color="dimmed">
                      Orientation du cas :
                    </Text>
                    <Text size="sm" weight={600} color="blue">
                      {data?.orientation?.instruction}
                    </Text>
                  </div>
                  {!data?.orientation?.services_instructeur ? null : (
                    <div className="data-section">
                      <Text size="xs" color="dimmed">
                        Services en charge du suivi du dossier :
                      </Text>
                      <List
                        size="xs"
                        icon={<FaUserCog size={16} color="dodgerblue" />}
                      >
                        {data?.orientation?.services_instructeur?.map((obj) => (
                          <List.Item key={obj._id}>
                            {obj?.service_name}
                          </List.Item>
                        ))}
                      </List>
                    </div>
                  )}

                  {data?.conclusion?.isComplete ? (
                    <>
                      <div className="data-section">
                        <Text size="xs" color="dimmed">
                          Décision de la CNLFM sur le cas
                        </Text>
                        <Text size="sm" weight={600} color="red">
                          {data?.conclusion?.decision ===
                          "concluded_restitution_avec_amende"
                            ? "Réstitution des substances avec amendes"
                            : data?.conclusion?.decision ===
                              "concluded_restitution_sans_amende"
                            ? "Réstitution des substances sans amendes"
                            : data?.conclusion?.decision ===
                              "concluded_restitution_legal"
                            ? "Réstitution au propriétaire légal"
                            : "Confiscation des substances"}
                        </Text>
                      </div>
                      {data?.conclusion?.decision ===
                      "concluded_restitution_avec_amende" ? (
                        <div className="data-section">
                          <Text size="xs" color="dimmed">
                            Total amendes
                          </Text>
                          <Text size="md" weight={600}>
                            $
                            {parseNumber((data?.conclusion?.amende).toFixed(2))}
                          </Text>
                        </div>
                      ) : null}

                      <div className="data-section">
                        <Text size="xs" color="dimmed">
                          Niveau d'éxécution de la décision
                        </Text>

                        {/* {data?.conclusion?.amende} */}
                        {data?.execution?.isComplete ? (
                          <Text size="sm" weight={600}>
                            <BsCheck2
                              color="green"
                              size={22}
                              style={{ marginBottom: -6 }}
                            />{" "}
                            Décision executée
                          </Text>
                        ) : (
                          <Text size="sm" weight={600}>
                            <BsX
                              color="red"
                              size={22}
                              style={{ marginBottom: -6 }}
                            />{" "}
                            Exécution en attente...
                          </Text>
                        )}
                      </div>

                      {data?.isCaseClosed ? null : data?.conclusion
                          ?.isComplete ? (
                        <div className="data-section">
                          <Text size="xs" color="dimmed">
                            Durée accordé pour réclamation ou appel
                          </Text>
                          <Text size="sm" weight={600}>
                            90 jours jusqu'au{" "}
                            {addDays(data?.conclusion.date, 45)
                              .toLocaleDateString()
                              .substring(0, 10)}
                          </Text>
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </Grid.Col>
              ) : null}
              {data?.isClosedInsito ? (
                <Grid.Col
                  span={12}
                  style={{
                    backgroundColor: "rgba(64, 194, 255, 0.02)",
                    border: "1px solid #eaeaea",
                    borderRadius: 8,
                    padding: "10px 14px",
                  }}
                >
                  <div className="data-section">
                    <Text size="xs" color="dimmed">
                      Categorisation du cas
                    </Text>
                    <Text size="sm" weight={600}>
                      Cas bénin et cloturé sur site
                    </Text>
                  </div>

                  {data?.conclusion?.isComplete ? (
                    <>
                      <div className="data-section">
                        <Text size="xs" color="dimmed">
                          Décision de la CNLFM sur le cas
                        </Text>
                        <Text size="sm" weight={600} color="red">
                          {data?.conclusion?.decision ===
                          "concluded_restitution_avec_amende"
                            ? "Réstitution des substances avec amendes"
                            : data?.conclusion?.decision ===
                              "concluded_restitution_sans_amende"
                            ? "Réstitution des substances sans amendes"
                            : data?.conclusion?.decision ===
                              "concluded_restitution_legal"
                            ? "Réstitution au propriétaire légal"
                            : "Confiscation des substances"}
                        </Text>
                      </div>

                      {data?.conclusion?.decision ===
                        "concluded_restitution_avec_amende" &&
                      userPermissions?.READ_SENSITIVE_DATA ? (
                        <div className="data-section">
                          <Text size="xs" color="dimmed">
                            Total amendes
                          </Text>
                          <Text size="md" weight={800}>
                            $
                            {parseNumber((data?.conclusion?.amende).toFixed(2))}
                          </Text>
                        </div>
                      ) : null}

                      <div className="data-section">
                        <Text size="xs" color="dimmed">
                          Niveau d'éxécution de la décision
                        </Text>

                        {/* {data?.conclusion?.amende} */}
                        {data?.execution?.isComplete ? (
                          <Text size="sm" weight={600}>
                            <BsCheck2
                              color="green"
                              size={22}
                              style={{ marginBottom: -6 }}
                            />{" "}
                            Décision executée
                          </Text>
                        ) : (
                          <Text size="sm" weight={600}>
                            <BsX
                              color="red"
                              size={22}
                              style={{ marginBottom: -6 }}
                            />{" "}
                            Exécution en attente...
                          </Text>
                        )}
                      </div>

                      {data?.isCaseClosed ? null : data?.conclusion
                          ?.isComplete ? (
                        <div className="data-section">
                          <Text size="xs" color="dimmed">
                            Durée accordé pour réclamation ou appel
                          </Text>
                          <Text size="sm" weight={600}>
                            90 jours jusqu'au{" "}
                            {addDays(data?.conclusion.date, 45)
                              .toLocaleDateString()
                              .substring(0, 10)}
                          </Text>
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </Grid.Col>
              ) : null}
              <Divider />
              {!data?.isCaseClosed && userPermissions.INVITE_MEMBERS ? (
                <Button
                  style={{ marginTop: 14 }}
                  onClick={() => setinvite(true)}
                  compact
                  variant="filled"
                  leftIcon={<FaBullhorn />}
                >
                  Inviter membres
                </Button>
              ) : null}
            </Grid>
          </Card>
        </Grid.Col>

        {window.innerWidth <= 768 ? null : (
          <Grid.Col xs={12} sm={12} md={8} lg={8} xl={6}>
            <Grid gutter="xs">
              <Grid.Col span={12}>
                <Card style={{ padding: 14 }}>
                  <div
                    style={{
                      width: "100%",
                      display: "inline-flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 24,
                    }}
                  >
                    <div>
                      <h2>Substances minérales</h2>
                      <Text size="xs" color="dimmed">
                        Aprés réconnaissance microscopique, les substances
                        minérales sont enregistrées ici.
                      </Text>
                    </div>
                    {!data?.isCaseClosed && userPermissions.ADD_DATA_TO_CASE ? (
                      <Button
                        onClick={() => setsubstance(true)}
                        size="sm"
                        leftIcon={<BsPlusLg />}
                        compact
                      >
                        Ajouter substance
                      </Button>
                    ) : null}
                  </div>
                  <table style={{ verticalAlign: "middle" }}>
                    <thead>
                      <tr>
                        <th style={{ width: "30%" }}>Nature & Filière</th>
                        <th style={{ width: "20%" }}>Poid & Cond.</th>
                        <th style={{ width: "20%" }}>Valeur & teneur</th>
                        <th style={{ width: "30%" }}>Gardien & consignation</th>
                        {/* <th style={{width:"12%"}}>Action</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {data?.substances?.length > 0 ? (
                        data?.substances?.map((substance) => (
                          <tr key={substance._id}>
                            <td>
                              <Text size="xs" mt={0}>
                                {substance?.nature}{" "}
                              </Text>
                              <em style={{ color: "dodgerblue" }}>
                                {substance?.filiere} ({substance?.category})
                              </em>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <Text size="xs">
                                {substance?.unit}{" "}
                                {substance?.weight?.toFixed(2)}
                              </Text>
                              <Text size="xs" color="dimmed">
                                {substance?.conditionnement?.name} (
                                {substance?.colis} colis)
                              </Text>
                            </td>
                            <td
                              style={{
                                textAlign: "right",
                                color: "dodgerblue",
                                fontSize: 16,
                              }}
                            >
                              <Text size="sm" weight="bold">
                                $
                                {parseNumber(
                                  substance?.valeur_marchande?.toFixed(2)
                                )}
                              </Text>
                              <Text size="xs" color="dimmed">
                                {substance?.teneur?.toFixed(1)}%
                              </Text>
                            </td>
                            <td>
                              <Text weight="bold" size="xs">
                                {userPermissions.READ_SENSITIVE_DATA
                                  ? substance?.gardiennage?.service_name
                                  : substance?.gardiennage?.service_name?.replace(
                                      /.(?=.{0})/g,
                                      "####"
                                    )}
                              </Text>
                              <Text size="xs" color="dimmed">
                                {userPermissions.READ_SENSITIVE_DATA
                                  ? substance?.consignation
                                  : substance?.consignation?.replace(
                                      /.(?=.{0})/g,
                                      "###"
                                    )}
                              </Text>
                            </td>

                            {/* <td>
                                                    <div style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent:'start'}}>
                                                        <ActionIcon size="sm" color="blue" variant='light' style={{marginRight:4}}><BsPencilSquare /></ActionIcon>
                                                        <ActionIcon size="sm" color="red" variant='light'><BsTrash /></ActionIcon>
                                                    </div>
                                                </td> */}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5}>
                            <Text weight={500} align="center">
                              Aucune donnée
                            </Text>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </Card>
              </Grid.Col>

              <Grid.Col span={12}>
                <Card style={{ padding: 14 }}>
                  <div
                    style={{
                      width: "100%",
                      display: "inline-flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 24,
                    }}
                  >
                    <div>
                      <h2>
                        Documents qui accompagnent les substances minérales
                      </h2>
                      <Text size="xs" color="dimmed">
                        Tous les documents collectés par rapport au présent cas
                        sont retrouvées ici.
                      </Text>
                    </div>
                    {!data?.isCaseClosed && userPermissions.ADD_DATA_TO_CASE ? (
                      <Button
                        onClick={() => setpvsTC(true)}
                        size="sm"
                        leftIcon={<BsUpload />}
                        compact
                      >
                        Joindre document
                      </Button>
                    ) : null}
                  </div>
                  <table style={{ verticalAlign: "middle" }}>
                    <thead>
                      <tr>
                        <th style={{ width: "45%" }}>Type de document</th>
                        <th style={{ width: "35%" }}>Nº du document</th>
                        <th style={{ width: "30%" }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.files?.length > 0 ? (
                        data?.files?.map((file) =>
                          file.field === "tracability" ? (
                            <tr key={file._id}>
                              {/* <td><Text variant="link" component="a" href={`http://192.168.43.246:1338/api/${file?.file_url}`} target={"_blank"} inherit><BsLink45Deg size={16} style={{marginBottom:-4}} />{file.category}</Text></td> */}
                              <td>
                                <Text
                                  variant="link"
                                  component="a"
                                  href={file?.file_url}
                                  target={"_blank"}
                                  inherit
                                >
                                  <BsLink45Deg
                                    size={16}
                                    style={{ marginBottom: -4 }}
                                  />
                                  {file.category}
                                </Text>
                              </td>
                              <td>{file.file_no}</td>
                              <td>
                                {new Date(file.createdAt)
                                  .toLocaleString("vh")
                                  .substring(0, 17)}
                              </td>
                            </tr>
                          ) : null
                        )
                      ) : (
                        <tr>
                          <td colSpan={3}>
                            <Text weight={500} align="center">
                              Aucune donnée
                            </Text>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </Card>
              </Grid.Col>

              <Grid.Col span={12}>
                <Card style={{ padding: 14 }}>
                  <div
                    style={{
                      width: "100%",
                      display: "inline-flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 24,
                    }}
                  >
                    <div>
                      <h2>Documents d'instruction du dossier de fraude</h2>
                      <Text size="xs" color="dimmed">
                        Tous les documents collectés par rapport au présent cas
                        sont retrouvées ici.
                      </Text>
                    </div>
                    {!data?.isCaseClosed && userPermissions.ADD_DATA_TO_CASE ? (
                      <Button
                        onClick={() => setpvsIN(true)}
                        size="sm"
                        leftIcon={<BsUpload />}
                        compact
                      >
                        Joindre document
                      </Button>
                    ) : null}
                  </div>
                  <table style={{ verticalAlign: "middle" }}>
                    <thead>
                      <tr>
                        <th style={{ width: "45%" }}>Type de document</th>
                        <th style={{ width: "35%" }}>Nº du document</th>
                        <th style={{ width: "30%" }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.files?.length > 0 ? (
                        data?.files?.map((file) =>
                          file.field === "instruction" ? (
                            <tr key={file._id}>
                              {/* <td><Text variant="link" component="a" href={`http://192.168.43.246:1338/api/${file?.file_url}`} target={"_blank"} inherit><BsLink45Deg size={16} style={{marginBottom:-4}} />{file.category}</Text></td> */}
                              <td>
                                <Text
                                  variant="link"
                                  component="a"
                                  href={file?.file_url}
                                  target={"_blank"}
                                  inherit
                                >
                                  <BsLink45Deg
                                    size={16}
                                    style={{ marginBottom: -4 }}
                                  />
                                  {file.category}
                                </Text>
                              </td>
                              <td>{file.file_no}</td>
                              <td>
                                {new Date(file.createdAt)
                                  .toLocaleString("vh")
                                  .substring(0, 17)}
                              </td>
                            </tr>
                          ) : null
                        )
                      ) : (
                        <tr>
                          <td colSpan={3}>
                            <Text weight={500} align="center">
                              Aucune donnée
                            </Text>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </Card>
              </Grid.Col>

              <Grid.Col span={12}>
                <Card style={{ padding: 14 }}>
                  <div
                    style={{
                      width: "100%",
                      display: "inline-flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 24,
                    }}
                  >
                    <div>
                      <h2>Documents d'exécution de la décision</h2>
                      <Text size="xs" color="dimmed">
                        Tous les documents collectés par rapport au présent cas
                        sont retrouvées ici.
                      </Text>
                    </div>
                    {!data?.isCaseClosed && userPermissions.ADD_DATA_TO_CASE ? (
                      <Button
                        onClick={() => setpvsEx(true)}
                        size="sm"
                        leftIcon={<BsUpload />}
                        compact
                      >
                        Joindre document
                      </Button>
                    ) : null}
                  </div>
                  <table style={{ verticalAlign: "middle" }}>
                    <thead>
                      <tr>
                        <th style={{ width: "45%" }}>Type de document</th>
                        <th style={{ width: "35%" }}>Nº du document</th>
                        <th style={{ width: "30%" }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.files?.length > 0 ? (
                        data?.files?.map((file) =>
                          file.field === "execution" ? (
                            <tr key={file._id}>
                              <td>
                                <Text
                                  variant="link"
                                  component="a"
                                  href={file?.file_url}
                                  target={"_blank"}
                                  inherit
                                >
                                  <BsLink45Deg
                                    size={16}
                                    style={{ marginBottom: -4 }}
                                  />
                                  {file.category}
                                </Text>
                              </td>
                              <td>{file.file_no}</td>
                              <td>
                                {new Date(file.createdAt)
                                  .toLocaleString("vh")
                                  .substring(0, 17)}
                              </td>
                            </tr>
                          ) : null
                        )
                      ) : (
                        <tr>
                          <td colSpan={3}>
                            <Text weight={500} align="center">
                              Aucune donnée
                            </Text>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </Card>
              </Grid.Col>

              {userPermissions.READ_SENSITIVE_DATA ? (
                <Grid.Col span={12}>
                  <Card style={{ padding: 14 }}>
                    <div
                      style={{
                        width: "100%",
                        display: "inline-flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 24,
                      }}
                    >
                      <div>
                        <h2>Presumés fraudeurs impliqués.</h2>
                        <Text size="xs" color="dimmed">
                          Tous les presumés fraudeurs et complices sont
                          retrouvés ici.
                        </Text>
                      </div>
                      {!data?.isCaseClosed &&
                      userPermissions.ADD_DATA_TO_CASE ? (
                        <Button
                          onClick={() => setprevenu(true)}
                          size="sm"
                          leftIcon={<BsPlusLg />}
                          compact
                        >
                          Ajouter fraudeur
                        </Button>
                      ) : null}
                    </div>
                    <table style={{ verticalAlign: "middle" }}>
                      <thead>
                        <tr>
                          <th style={{ width: "34%" }}>Nom complet</th>
                          <th style={{ width: "22%" }}>Nationalité & ID</th>
                          <th style={{ width: "30%" }}>Profession & role</th>
                          <th style={{ width: "25%" }}>Frequence</th>
                          {/* <th style={{width: "15%"}}>Actions</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {data?.prevenus?.length > 0 ? (
                          data?.prevenus?.map((prevenu) => (
                            <tr key={prevenu._id}>
                              <td>
                                <Text size="xs">
                                  {prevenu?.fraudeur?.nom?.concat(
                                    " ",
                                    prevenu?.fraudeur?.postnom,
                                    " ",
                                    prevenu?.fraudeur?.prenom
                                  )}
                                </Text>
                                <Text
                                  variant="link"
                                  component="a"
                                  href={prevenu?.doc_url}
                                  target={"_blank"}
                                  inherit
                                >
                                  <BsLink45Deg
                                    size={16}
                                    style={{ marginBottom: -4 }}
                                  />
                                  Télécharger
                                </Text>
                              </td>
                              <td>
                                <Text size="xs">
                                  {prevenu?.fraudeur?.nationalite}
                                </Text>
                                <Text size="xs" color="green">
                                  {prevenu?.no_identite}
                                </Text>
                              </td>
                              <td>
                                <Text size="xs">{prevenu.profession}</Text>
                                <Text size="xs" color="red">
                                  {prevenu?.role}
                                </Text>
                              </td>
                              <td>
                                <Text size="sm" weight={400}>
                                  {prevenu?.fraudeur?.forfaits} forfait(s)
                                </Text>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4}>
                              <Text weight={500} align="center">
                                Aucune donnée
                              </Text>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </Card>
                </Grid.Col>
              ) : null}

              <Grid.Col span={12}>
                <Card style={{ padding: 14 }}>
                  <div
                    style={{
                      width: "100%",
                      display: "inline-flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 24,
                    }}
                  >
                    <div>
                      <h2>Equipements, materiels ou moyens utilisés.</h2>
                      <Text size="xs" color="dimmed">
                        Tous les moyens de fraude et leurs informations cas sont
                        retrouvés ici.
                      </Text>
                    </div>
                    {!data?.isCaseClosed && userPermissions.ADD_DATA_TO_CASE ? (
                      <Button
                        onClick={() => setmoyen(true)}
                        size="sm"
                        leftIcon={<BsPlusLg />}
                        compact
                      >
                        Ajouter moyen
                      </Button>
                    ) : null}
                  </div>
                  <table style={{ verticalAlign: "middle" }}>
                    <thead>
                      <tr>
                        <th style={{ width: "15%" }}>Category</th>
                        <th style={{ width: "15%" }}>Marque</th>
                        <th style={{ width: "15%" }}>Model</th>
                        <th style={{ width: "15%" }}>Couleur</th>
                        <th style={{ width: "15%" }}>Plaque</th>
                        <th style={{ width: "20%" }}>Chassis</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.materials?.length > 0 ? (
                        data?.materials?.map((material) => (
                          <tr key={material._id}>
                            <td>
                              <Text size="xs" inherit>
                                {material?.category}
                              </Text>
                            </td>
                            <td>
                              <Text size="xs" color="blue" inherit>
                                {material?.marque}
                              </Text>
                            </td>
                            <td>
                              <Text size="xs" inherit>
                                {material?.model}
                              </Text>
                            </td>
                            <td>
                              <Text size="xs" inherit>
                                {material?.couleur}
                              </Text>
                            </td>
                            <td>
                              <Text size="xs" weight={400} inherit>
                                {userPermissions.READ_SENSITIVE_DATA
                                  ? material?.plaque
                                  : material?.plaque?.replace(
                                      /.(?=.{0})/g,
                                      "##"
                                    )}
                              </Text>
                            </td>
                            <td>
                              <Text size="xs" weight={400} inherit>
                                {userPermissions.READ_SENSITIVE_DATA
                                  ? material?.chassis
                                  : material?.chassis?.replace(
                                      /.(?=.{0})/g,
                                      "##"
                                    )}
                              </Text>
                            </td>
                            {/* <td>
                                <div style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent:'start'}}>
                                    <ActionIcon size="sm" color="cyan" variant='light' style={{marginRight:14}}><BsPencilSquare /></ActionIcon>
                                    <ActionIcon size="sm" color="red" variant='light'><BsTrash /></ActionIcon>
                                </div>
                            </td> */}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6}>
                            <Text weight={500} align="center">
                              Aucune donnée
                            </Text>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </Card>
              </Grid.Col>

              <Grid.Col span={12}>
                <Card style={{ padding: 14 }}>
                  <div
                    style={{
                      width: "100%",
                      display: "inline-flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 24,
                    }}
                  >
                    <div>
                      <h2>Rapports des différentes reunions effectuées</h2>
                      <Text size="xs" color="dimmed">
                        Tous les rapports des reunions relatives au présent cas
                        sont retrouvées ici.
                      </Text>
                    </div>
                    {!data?.isCaseClosed && userPermissions.ADD_DATA_TO_CASE ? (
                      <Button
                        onClick={() => setinvitation(true)}
                        size="sm"
                        leftIcon={<BsUpload />}
                        compact
                      >
                        Joindre rapport
                      </Button>
                    ) : null}
                  </div>
                  <table style={{ verticalAlign: "middle" }}>
                    <thead>
                      <tr>
                        <th style={{ width: "12%" }}>Date</th>
                        <th style={{ width: "10%" }}>Heure</th>
                        <th style={{ width: "20%" }}>Lieu</th>
                        <th style={{ width: "30%" }}>Participants</th>
                        <th style={{ width: "20%" }}>Rapport/décision</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.invitations?.length > 0 ? (
                        data?.invitations?.map((report) => (
                          <tr key={report._id}>
                            <td>
                              {new Date(report?.date_meeting)
                                .toLocaleString("vh")
                                .substring(0, 10)}
                            </td>
                            <td>
                              {new Date(report?.time_meeting)
                                .toLocaleString("vh")
                                .substring(12, 17)}
                            </td>
                            <td>{report?.location}</td>
                            <td>{report?.service?.join(", ")}</td>
                            <td>
                              <Text
                                variant="link"
                                component="a"
                                href={report?.report_url}
                                target={"_blank"}
                                inherit
                              >
                                <BsLink45Deg
                                  size={16}
                                  style={{ marginBottom: -4 }}
                                />
                                Télécharger
                              </Text>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5}>
                            <Text weight={500} align="center">
                              Aucune donnée
                            </Text>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </Card>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        )}

        <Grid.Col xs={12} sm={12} md={12} lg={12} xl={3}>
          <Grid gutter="xs">
            <Grid.Col span={12}>
              <Card style={{ padding: 14 }}>
                <div
                  style={{
                    width: "100%",
                    display: "inline-flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                  }}
                >
                  <div>
                    <h2>Chronologie du cas</h2>
                    <Text size="xs" color="dimmed">
                      Activités récentes du cas en cours.
                    </Text>
                  </div>
                </div>
                <Timeline
                  active={data?.logs?.logs?.length}
                  lineWidth={2}
                  bulletSize={22}
                  color="dodgerblue"
                  reverseActive
                  style={{ marginBottom: 14 }}
                >
                  {data?.logs?.logs
                    ?.slice(0)
                    ?.reverse()
                    .map((log) => (
                      <Timeline.Item key={log._id} mb={-14} lineVariant="solid">
                        <div>
                          <Text
                            weight={600}
                            color="blue"
                            size="sm"
                            pt={-2}
                            mb={0}
                          >
                            {log?.step}
                          </Text>
                          <Text color="dimmed" size="xs">
                            {log?.content}
                          </Text>
                          <Text size="xs" mt={4}>
                            {moment
                              .utc(log?.date)
                              .local()
                              .startOf("seconds")
                              .fromNow()}
                          </Text>
                        </div>
                      </Timeline.Item>
                    ))}
                </Timeline>
              </Card>
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>

      <Modal
        opened={pvsTC}
        onClose={() => setpvsTC(false)}
        title={
          <Title
            order={5}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "400",
              color: "green",
            }}
          >
            <BsFilesAlt size={20} style={{ marginRight: 8 }} /> Joindre document
            d'accompagnement
          </Title>
        }
      >
        <FormPv
          data={data}
          category="tracability"
          handleClose={() => setpvsTC(false)}
        />
      </Modal>

      <Modal
        opened={pvsIN}
        onClose={() => setpvsIN(false)}
        title={
          <Title
            order={5}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "400",
              color: "green",
            }}
          >
            <BsFilesAlt size={20} style={{ marginRight: 8 }} /> Joindre document
            d'instruction
          </Title>
        }
      >
        <FormPv
          data={data}
          category="instruction"
          handleClose={() => setpvsIN(false)}
        />
      </Modal>

      <Modal
        opened={pvsEx}
        onClose={() => setpvsEx(false)}
        title={
          <Title
            order={5}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "400",
              color: "green",
            }}
          >
            <BsFilesAlt size={20} style={{ marginRight: 8 }} /> Joindre document
            d'exécution de la décision
          </Title>
        }
      >
        <FormPv
          data={data}
          category="execution"
          handleClose={() => setpvsEx(false)}
        />
      </Modal>

      <Modal
        opened={substance}
        onClose={() => setsubstance(false)}
        title={
          <Title
            order={5}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "400",
              color: "#fa5555",
            }}
          >
            <GiMinerals size={20} style={{ marginRight: 8 }} /> Substance
            minérale
          </Title>
        }
      >
        <FormSubstance data={data} handleClose={() => setsubstance(false)} />
      </Modal>

      <Modal
        opened={prevenu}
        onClose={() => setprevenu(false)}
        title={
          <Title
            order={5}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "400",
              color: "green",
            }}
          >
            <BsPersonBadge size={20} style={{ marginRight: 8 }} /> Presumé
            fraudeur
          </Title>
        }
      >
        <FormPrevenu data={data} handleClose={() => setprevenu(false)} />
      </Modal>

      <Modal
        opened={moyen}
        onClose={() => setmoyen(false)}
        title={
          <Title
            order={5}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "400",
              color: "#fa5555",
            }}
          >
            <BsTruck size={20} style={{ marginRight: 8 }} /> Moyen de fraude
          </Title>
        }
      >
        <FormMoyen data={data} handleClose={() => setmoyen(false)} />
      </Modal>

      <Modal
        opened={invitation}
        onClose={() => setinvitation(false)}
        title={
          <Title
            order={5}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "400",
              color: "#fa5555",
            }}
          >
            <BsFilesAlt size={20} style={{ marginRight: 8 }} /> Rapport de la
            réunion
          </Title>
        }
      >
        <FormInvitation
          status="report"
          data={data}
          handleClose={() => setinvitation(false)}
        />
      </Modal>

      <Modal
        opened={invite}
        onClose={() => setinvite(false)}
        title={
          <Title
            order={5}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "400",
              color: "#fa5555",
            }}
          >
            <FaBullhorn size={20} style={{ marginRight: 8 }} /> Lancer une
            invitation
          </Title>
        }
      >
        <FormInvitation
          status="invite"
          data={data}
          handleClose={() => setinvite(false)}
        />
      </Modal>
    </div>
  );
}

export default DisplayFraudCase;
