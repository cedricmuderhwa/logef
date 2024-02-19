import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Drawer,
  Grid,
  Modal,
  Pagination,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  BsArchive,
  BsArrowRight,
  BsBoxArrowInDownRight,
  BsCalendar,
  BsCheck2,
  BsCheck2Circle,
  BsClockHistory,
  BsExclamationTriangleFill,
  BsEyeFill,
  BsFillExclamationOctagonFill,
  BsFillFolderSymlinkFill,
  BsFolderCheck,
  BsFolderFill,
  BsFolderPlus,
  BsFolderSymlink,
  BsInboxFill,
  BsInfoCircle,
  BsLock,
  BsLockFill,
  BsPinMapFill,
  BsQuestionOctagonFill,
  BsSearch,
  BsXCircle,
} from "react-icons/bs";
import {
  FaArchive,
  FaFileArchive,
  FaLock,
  FaRegShareSquare,
  FaUserCog,
} from "react-icons/fa";
import { IoHandRight } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import DisplayFraudCase from "../../components/DisplayFraudCase";
import FormAppel from "../../components/FormAppel";
import FormArchive from "../../components/FormArchive";
import FormConclusion from "../../components/FormConclusion";
import FormConclusionInsito from "../../components/FormConclusionInsito";
import FormExecution from "../../components/FormExecution";
import FormOrientation from "../../components/FormOrientation";
import FormSignal from "../../components/FormSignal";
import FormTransfert from "../../components/FormTransfer";
import FullPageLoader from "../../components/FullPageLoader/FullPageLoader";
import { LoadFrauds } from "../../hooks/fetchFraud";
import { LoadServices } from "../../hooks/fetchService";
import { findSelected } from "../../redux/slices/current";
import { findFrauds, updateFraud } from "../../redux/slices/fraud_cases";
import "./fraud-cases.scss";

function FraudCases() {
  const dispatch = useDispatch();
  const frauds = useSelector((state) => state.fraud_cases);
  const [cases, setcases] = useState([]);
  const [openNewCase, setopenNewCase] = useState(false);
  const [orientation, setorientation] = useState(false);
  const [transfer, settransfer] = useState(false);
  const [cloture, setcloture] = useState(false);
  const [archive, setArchive] = useState(false);
  const [clotureinsito, setclotureinsito] = useState(false);
  const [executionInsito, setexecutionInsito] = useState(false);
  const [execution, setExecution] = useState(false);
  const [appel, setAppel] = useState(false);
  const [selectedData, setselectedData] = useState();
  const loggedInUser = useSelector((state) => state.sessions.authUser);
  const userPermissions = useSelector(
    (state) => state.sessions.authUser
  ).permissions;

  const today = moment();

  const [openDisplayCase, setopenDisplayCase] = useState(false);
  const [loading, fraudCases] = LoadFrauds();

  LoadServices();

  const theme = useMantineTheme();

  const modals = useModals();

  const [activePage, setActivePage] = useState(1);
  const [pageCount, setpageCount] = useState(1);

  const searchString = useRef();

  useEffect(() => {
    setcases(frauds);
    setpageCount(fraudCases.pageCount);

    return () => {
      setcases([]);
    };
  }, [frauds, fraudCases]);

  const handleSearchChange = async (event) => {
    const { value } = event.currentTarget;
    if (value.length === 0) {
      await handleFetch({ page: 1, limit: 10, search: "none" });
    }
  };

  const openConfirmNonFrauduleux = (e, data) =>
    modals.openConfirmModal({
      title: (
        <Text
          size="md"
          weight={700}
          color="red"
          style={{ display: "inline-flex", alignItems: "center" }}
        >
          <BsArchive size={24} style={{ marginRight: 8 }} />
          Classer comme non-frauduleux ?
        </Text>
      ),
      children: (
        <Text size="xs">
          Etes-vous sure de vouloir classer ce cas comme non-frauduleux ? Cette
          action est irreversible.
        </Text>
      ),
      zIndex: 201,
      labels: { confirm: "Confirmer", cancel: "Annuler" },
      confirmProps: { color: "red", size: "xs" },
      cancelProps: { size: "xs" },
      onCancel: () => console.log("Cancel"),
      onConfirm: async () => {
        const res = await dispatch(
          updateFraud({
            _id: data?._id,
            dataToSubmit: { action: "archive", status: "sans-suite" },
          })
        );
        if (res.payload) {
          return showNotification({
            color: "green",
            title: "Success",
            message: "update successful",
            icon: <BsCheck2 size={24} />,
          });
        }
        return showNotification({
          color: "orange",
          title: "Forbidden",
          message: "You are not authorized to perfom this action!!",
          icon: <IoHandRight size={26} />,
        });
      },
    });

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  const openConfirmCase = (e, data) =>
    modals.openConfirmModal({
      title: (
        <Text
          size="md"
          weight={700}
          color="teal"
          style={{ display: "inline-flex", alignItems: "center" }}
        >
          <BsCheck2Circle size={24} style={{ marginRight: 8 }} />
          Confirmer le cas de fraude ?
        </Text>
      ),
      children: (
        <Text size="xs">
          Etes-vous sure de vouloir confirmer ce cas comme etant un cas
          frauduleux ? Cette action est irreversible.
        </Text>
      ),
      zIndex: 201,
      labels: { confirm: "Confirmer", cancel: "Annuler" },
      confirmProps: { color: "teal", size: "xs" },
      cancelProps: { size: "xs" },
      onCancel: () => console.log("Cancel"),
      onConfirm: async () => {
        const res = await dispatch(
          updateFraud({
            _id: data?._id,
            dataToSubmit: {
              action: "confirm",
              isConfirmed: true,
              status: "confirmed",
            },
          })
        );

        if (res.payload) {
          return showNotification({
            color: "green",
            title: "Success",
            message: "update successful",
            icon: <BsCheck2 size={24} />,
          });
        }
        return showNotification({
          color: "orange",
          title: "Forbidden",
          message: "You are not authorized to perfom this action!!",
          icon: <IoHandRight size={26} />,
        });
      },
    });

  const openConstestCaseInsito = (e, data) =>
    modals.openConfirmModal({
      title: (
        <Text
          size="md"
          weight={700}
          color="teal"
          style={{ display: "inline-flex", alignItems: "center" }}
        >
          <BsExclamationTriangleFill size={24} style={{ marginRight: 8 }} />
          Contester la décision de la CNLFM ?
        </Text>
      ),
      children: (
        <Text size="xs">
          Etes-vous sure de vouloir contester ce cas et le transférer au bureau
          de la coordination provinciale ? Cette action est irréversible.
        </Text>
      ),
      zIndex: 201,
      labels: { confirm: "Confirmer", cancel: "Annuler" },
      confirmProps: { color: "red", size: "xs" },
      cancelProps: { size: "xs" },
      onCancel: () => console.log("Cancel"),
      onConfirm: async () => {
        const res = await dispatch(
          updateFraud({
            _id: data?._id,
            dataToSubmit: {
              action: "contest-insito",
            },
          })
        );

        if (res.payload) {
          return showNotification({
            color: "green",
            title: "Success",
            message: "update successful",
            icon: <BsCheck2 size={24} />,
          });
        }
        return showNotification({
          color: "orange",
          title: "Forbidden",
          message: "You are not authorized to perfom this action!!",
          icon: <IoHandRight size={26} />,
        });
      },
    });

  const handlePagination = async (e) => {
    const dataToSubmit = {
      page: e,
      limit: 12,
      search: "none",
    };

    await handleFetch(dataToSubmit);
  };

  const handleSearch = async (e) => {
    const dataToSubmit = {
      page: 1,
      limit: 12,
      search:
        (searchString?.current.value).length === 0
          ? "none"
          : searchString?.current.value,
    };

    await handleFetch(dataToSubmit);
  };

  async function handleFetch(dataToSubmit) {
    const res = await dispatch(findFrauds(dataToSubmit));

    if (res.payload) {
      setActivePage(dataToSubmit.page);
      setpageCount(res?.payload.pageCount);
      setcases(res?.payload.results);
    }
  }

  const handleSelect = async (selected) => {
    await dispatch(findSelected(selected._id)).data;
  };

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <div style={{ padding: "6px 10px 6px 10px" }}>
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
            <BsFillExclamationOctagonFill
              fontSize={18}
              style={{ marginRight: 8 }}
            />{" "}
            Cas de fraude
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
          <Card style={{ padding: 7 }}>
            <div className="header-searchbar">
              <div>
                {userPermissions.SIGNAL_FRAUD_CASE ? (
                  <Button
                    variant="outline"
                    size="xs"
                    color="red"
                    radius={4}
                    leftIcon={<BsFillExclamationOctagonFill size={18} />}
                    onClick={() => setopenNewCase(true)}
                    style={{ marginRight: 14 }}
                  >
                    Signaler un cas
                  </Button>
                ) : null}
                {/* <Button variant="outline" size="xs" color='orange' radius={4} leftIcon={<BsExclamationTriangle size={18} />} onClick={() => setopenNewCaseIrregular(true)}>Cas irregulier</Button> */}
              </div>
              <TextInput
                variant="filled"
                placeholder="Rechercher par code"
                ref={searchString}
                onChange={handleSearchChange}
                icon={<BsSearch />}
                style={{ width: 300 }}
                rightSection={
                  <ActionIcon
                    color={theme.primaryColor}
                    onClick={handleSearch}
                    variant="filled"
                  >
                    <BsArrowRight size={18} />
                  </ActionIcon>
                }
              />
            </div>
            <Divider />
            <Grid gutter="xs" style={{ marginTop: 12 }}>
              {cases?.length !== 0 ? (
                cases?.map((fraud) => (
                  <Grid.Col
                    xs={6}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={3}
                    key={fraud._id}
                    onDoubleClick={() => {
                      setopenDisplayCase(true);
                      setselectedData(fraud);
                      handleSelect(fraud);
                    }}
                  >
                    <div className="fraud-case">
                      <div className="fraud-header">
                        <Avatar
                          color={
                            fraud.status === "signal"
                              ? "red"
                              : fraud.status === "sans-suite"
                              ? "gray"
                              : fraud.status === "confirmed"
                              ? "indigo"
                              : fraud.status === "transferred"
                              ? "cyan"
                              : fraud.status === "oriented"
                              ? "grape"
                              : fraud.isCaseClosed
                              ? "gray"
                              : "green"
                          }
                          size={72}
                        >
                          {fraud.isCaseClosed ? (
                            <BsArchive size={32} />
                          ) : fraud.status === "signal" ? (
                            <BsQuestionOctagonFill size={32} />
                          ) : fraud.status === "sans-suite" ? (
                            <FaFileArchive size={32} />
                          ) : fraud.status === "confirmed" ? (
                            <BsClockHistory size={32} />
                          ) : fraud.status === "transferred" ? (
                            <BsFillFolderSymlinkFill size={32} />
                          ) : fraud.status === "oriented" ? (
                            <BsFolderFill size={32} />
                          ) : (
                            <BsFolderCheck size={32} />
                          )}
                        </Avatar>
                        <div className="fraud-case-data">
                          <h3>{fraud.code}</h3>
                          <Text size="xs">
                            <BsCalendar
                              size={16}
                              style={{ marginBottom: -2, marginRight: 6 }}
                            />
                            {new Date(fraud?.signalement.date)
                              .toLocaleString("vh")
                              .substring(0, 17)}
                          </Text>
                          {/* <Text size='xs' style={{marginTop: 2}}><FaUserCog size={16} style={{marginBottom: -3, marginRight: 6}} />{fraud?.signalement?.service?.service_name?.replace(/.(?=.{0})/g, '#')}</Text> */}
                          {userPermissions.READ_SENSITIVE_DATA ? (
                            <Text size="xs" style={{ marginTop: 2 }}>
                              <FaUserCog
                                size={16}
                                style={{ marginBottom: -3, marginRight: 6 }}
                              />
                              {fraud?.signalement?.service?.service_name}
                            </Text>
                          ) : null}
                        </div>
                      </div>
                      <div className="status-bar">
                        {fraud.conclusion.isComplete ? (
                          fraud.conclusion.decision ===
                          "concluded_restitution_avec_amende" ? (
                            <Badge
                              variant="gradient"
                              gradient={{ from: "lime", to: "green" }}
                              radius="xs"
                              fullWidth
                            >
                              Réstitution au fraudeur avec amende
                            </Badge>
                          ) : fraud.conclusion.decision ===
                            "concluded_restitution_sans_amende" ? (
                            <Badge
                              variant="gradient"
                              gradient={{ from: "lime", to: "green" }}
                              radius="xs"
                              fullWidth
                            >
                              Réstitution au fraudeur sans amende
                            </Badge>
                          ) : fraud.conclusion.decision ===
                            "concluded_restitution_legal" ? (
                            <Badge
                              variant="gradient"
                              gradient={{ from: "lime", to: "green" }}
                              radius="xs"
                              fullWidth
                            >
                              Réstitution au propriétaire légal (cas de vol)
                            </Badge>
                          ) : fraud.conclusion.decision ===
                            "concluded_confiscation" ? (
                            <Badge
                              variant="gradient"
                              gradient={{ from: "lime", to: "green" }}
                              radius="xs"
                              fullWidth
                            >
                              Confiscation comme patrimoine de l'Etat Congolais
                            </Badge>
                          ) : fraud.isConfirmed ? (
                            <Text size="sm" italic color="blue">
                              En cours de verification
                            </Text>
                          ) : (
                            <Text size="sm" italic color="indigo">
                              En cours de vérification
                            </Text>
                          )
                        ) : (
                          <Text size="sm" italic color="blue">
                            {!fraud.isConfirmed
                              ? "En cours de vérification..."
                              : "Prise en charge en cours..."}
                          </Text>
                        )}
                      </div>
                      <Divider />
                      <div className="summary">
                        <Text
                          size="xs"
                          color="gray"
                          style={{ marginBottom: 8 }}
                          className="text-observation"
                        >
                          {fraud?.signalement?.observation}
                        </Text>
                        <span className="details">
                          <BsPinMapFill size={14} />
                          <Text size="xs" style={{ marginLeft: 4 }}>
                            {fraud?.signalement?.arrest_location}
                          </Text>
                        </span>
                      </div>
                      <Divider />

                      {/* Get the thing to do */}

                      <div className="status-bar">
                        {fraud.status === "signal" ? (
                          <Badge
                            variant="light"
                            color="red"
                            radius="xs"
                            fullWidth
                          >
                            En attente d'instruction provisoire
                          </Badge>
                        ) : fraud.status === "sans-suite" ? (
                          <Badge
                            variant="light"
                            color="black"
                            radius="xs"
                            fullWidth
                          >
                            Classé comme cas non-frauduleux
                          </Badge>
                        ) : fraud.status === "confirmed" ? (
                          <Badge
                            variant="light"
                            color="cyan"
                            radius="xs"
                            fullWidth
                          >
                            En cours de constat
                          </Badge>
                        ) : fraud.status === "transferred" ? (
                          <Badge
                            variant="light"
                            color="teal"
                            radius="xs"
                            fullWidth
                          >
                            En attente d'orientation
                          </Badge>
                        ) : fraud.status === "oriented" ? (
                          <Badge
                            variant="light"
                            color="grape"
                            radius="xs"
                            fullWidth
                          >
                            En attente d'instruction
                          </Badge>
                        ) : fraud.status ===
                          "concluded_restitution_avec_amende" ? (
                          <Badge
                            variant="light"
                            color="gray"
                            radius="xs"
                            fullWidth
                          >
                            {fraud.isCaseClosed
                              ? "Dossier cloturé et classé"
                              : "En cours de traitement..."}
                          </Badge>
                        ) : fraud.status ===
                          "concluded_restitution_sans_amende" ? (
                          <Badge
                            variant="light"
                            color="gray"
                            radius="xs"
                            fullWidth
                          >
                            {fraud.isCaseClosed
                              ? "Dossier cloturé et classé"
                              : "En cours de traitement..."}
                          </Badge>
                        ) : fraud.status === "concluded_restitution_legal" ? (
                          <Badge
                            variant="light"
                            color="gray"
                            radius="xs"
                            fullWidth
                          >
                            {fraud.isCaseClosed
                              ? "Dossier cloturé et classé"
                              : "En cours de traitement..."}
                          </Badge>
                        ) : fraud.status === "concluded_confiscation" ? (
                          <Badge
                            variant="light"
                            color="gray"
                            radius="xs"
                            fullWidth
                          >
                            {fraud.isCaseClosed
                              ? "Dossier cloturé et classé"
                              : "En cours de traitement..."}
                          </Badge>
                        ) : fraud.status === "contestation" ? (
                          <Badge
                            variant="light"
                            color="orange"
                            radius="xs"
                            fullWidth
                          >
                            Transferé pour contestation
                          </Badge>
                        ) : fraud.status === "appel" &&
                          fraud.appel.isComplete ? (
                          <>
                            {fraud.isCaseClosed ? (
                              <Badge
                                variant="light"
                                color="gray"
                                radius="xs"
                                fullWidth
                              >
                                Dossier cloturé et classé
                              </Badge>
                            ) : (
                              <Badge
                                variant="light"
                                color="orange"
                                radius="xs"
                                fullWidth
                              >
                                Transferé pour fixation
                              </Badge>
                            )}
                          </>
                        ) : fraud.execution.isComplete ? (
                          <Badge
                            variant="light"
                            color="green"
                            radius="xs"
                            fullWidth
                          >
                            Décision déjà éxécuté
                          </Badge>
                        ) : fraud.status === "closed" && fraud.isCaseClosed ? (
                          <Badge
                            variant="light"
                            color="gray"
                            radius="xs"
                            fullWidth
                          >
                            <FaFileArchive /> Dossier classé et archivé
                          </Badge>
                        ) : null}
                      </div>
                      {userPermissions.MODIFY_CASE_STATUS ? (
                        <div>
                          {fraud.isCaseClosed ? (
                            <>
                              <Divider />
                              <div className="fraud-action">
                                <p
                                  style={{
                                    fontSize: 12,
                                    display: "inline-flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <BsEyeFill style={{ marginRight: 7 }} /> Read
                                  only
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <Divider />
                              {fraud.status === "signal" ? (
                                <div
                                  className="fraud-action"
                                  style={{ position: "relative" }}
                                >
                                  <Button
                                    onClick={(e) =>
                                      openConfirmNonFrauduleux(e, fraud)
                                    }
                                    style={{ position: "relative", zIndex: 44 }}
                                    variant="filled"
                                    leftIcon={<BsXCircle size={16} />}
                                    color="red"
                                    size="xs"
                                  >
                                    Non-frauduleux
                                  </Button>
                                  <Button
                                    onClick={(e) => openConfirmCase(e, fraud)}
                                    variant="filled"
                                    color="blue"
                                    style={{
                                      marginLeft: 8,
                                      position: "relative",
                                      zIndex: 44,
                                    }}
                                    leftIcon={<BsCheck2Circle size={16} />}
                                    size="xs"
                                  >
                                    Confirmer
                                  </Button>
                                </div>
                              ) : fraud.status === "sans-suite" ? (
                                <div className="fraud-action">
                                  <Text size="xs" color="dimmed">
                                    Fausse alerte
                                  </Text>
                                </div>
                              ) : fraud.status === "confirmed" ? (
                                <div className="fraud-action">
                                  <Button
                                    onClick={() => {
                                      settransfer(true);
                                      setselectedData(fraud);
                                    }}
                                    color="gray"
                                    leftIcon={<BsFolderSymlink size={16} />}
                                    size="xs"
                                  >
                                    Transférer
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setclotureinsito(true);
                                      setselectedData(fraud);
                                    }}
                                    leftIcon={<BsLock size={16} />}
                                    style={{ marginLeft: 8 }}
                                    color="blue"
                                    size="xs"
                                  >
                                    Instruire sur site
                                  </Button>
                                </div>
                              ) : fraud.status === "transferred" ? (
                                <div className="fraud-action">
                                  <Button
                                    onClick={() => {
                                      setorientation(true);
                                      setselectedData(fraud);
                                    }}
                                    color="blue"
                                    style={{ marginLeft: 8 }}
                                    leftIcon={
                                      <BsBoxArrowInDownRight size={16} />
                                    }
                                    size="xs"
                                  >
                                    Orienter le dossier
                                  </Button>
                                </div>
                              ) : fraud.status === "oriented" ? (
                                <div className="fraud-action">
                                  <Button
                                    onClick={() => {
                                      setcloture(true);
                                      setselectedData(fraud);
                                    }}
                                    color="blue"
                                    style={{ marginLeft: 8 }}
                                    leftIcon={<BsCheck2Circle size={16} />}
                                    size="xs"
                                  >
                                    Instruire le dossier
                                  </Button>
                                </div>
                              ) : (
                                <div
                                  className="fraud-action"
                                  style={{
                                    justifyContent: fraud.isClosedInsito
                                      ? "space-between"
                                      : "end",
                                  }}
                                >
                                  {fraud.isClosedInsito ? (
                                    <>
                                      <Text size="xs" color="blue">
                                        <BsInfoCircle
                                          style={{
                                            marginRight: 4,
                                            marginBottom: -2,
                                          }}
                                          size={16}
                                        />{" "}
                                        Cloturé sur site{" "}
                                      </Text>

                                      <div>
                                        {fraud.execution.isComplete ? null : (
                                          <Button
                                            onClick={() => {
                                              setexecutionInsito(true);
                                              setselectedData(fraud);
                                            }}
                                            color="blue"
                                            style={{ marginLeft: 8 }}
                                            leftIcon={<BsLockFill size={16} />}
                                            size="xs"
                                          >
                                            Exécuter
                                          </Button>
                                        )}
                                        <Button
                                          onClick={(e) => {
                                            openConstestCaseInsito(e, fraud);
                                          }}
                                          color="blue"
                                          style={{ marginLeft: 8 }}
                                          leftIcon={
                                            <BsFolderSymlink size={16} />
                                          }
                                          size="xs"
                                        >
                                          Contester
                                        </Button>
                                      </div>
                                    </>
                                  ) : (
                                    <div>
                                      {fraud.execution.isComplete ||
                                      fraud.appel.isComplete ? null : (
                                        <Button
                                          onClick={() => {
                                            setExecution(true);
                                            setselectedData(fraud);
                                          }}
                                          color="blue"
                                          style={{ marginLeft: 8 }}
                                          leftIcon={<BsLockFill size={16} />}
                                          size="xs"
                                        >
                                          Exécuter
                                        </Button>
                                      )}

                                      {moment(
                                        new Date(
                                          addDays(fraud.conclusion.date, 90)
                                        ),
                                        "YYYY-MM-DD"
                                      ).isAfter(today) ? (
                                        <>
                                          {fraud.appel.isComplete ? (
                                            <Button
                                              onClick={() => {
                                                setArchive(true);
                                                setselectedData(fraud);
                                              }}
                                              color="blue"
                                              leftIcon={<FaArchive size={16} />}
                                              size="xs"
                                            >
                                              Cloturer et Archiver
                                            </Button>
                                          ) : (
                                            <Button
                                              onClick={() => {
                                                setAppel(true);
                                                setselectedData(fraud);
                                              }}
                                              color="blue"
                                              style={{ marginLeft: 8 }}
                                              leftIcon={
                                                <BsFolderSymlink size={16} />
                                              }
                                              size="xs"
                                            >
                                              Fixation
                                            </Button>
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          {moment(
                                            new Date(
                                              addDays(fraud.conclusion.date, 90)
                                            ),
                                            "YYYY-MM-DD"
                                          ).isBefore(today) ? (
                                            <div>
                                              <Button
                                                onClick={() => {
                                                  setArchive(true);
                                                  setselectedData(fraud);
                                                }}
                                                color="blue"
                                                style={{ marginLeft: 8 }}
                                                leftIcon={
                                                  <FaArchive size={16} />
                                                }
                                                size="xs"
                                              >
                                                Cloturer et Archiver
                                              </Button>
                                            </div>
                                          ) : null}
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </Grid.Col>
                ))
              ) : (
                <div
                  style={{
                    height: "65vh",
                    width: "100%",
                    display: "grid",
                    placeContent: "center",
                  }}
                >
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
                </div>
              )}
            </Grid>
            <Divider style={{ marginBlock: 14 }} />
            <div
              style={{
                width: "100%",
                display: "inline-flex",
                justifyContent: "center",
              }}
            >
              <Pagination
                color="blue"
                size="sm"
                initialPage={activePage}
                onChange={handlePagination}
                total={pageCount}
                withEdges
              />
            </div>
          </Card>
        </Grid.Col>
      </Grid>
      <Drawer
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        padding="xs"
        overlayOpacity={0.15}
        position="right"
        size={window.innerWidth <= 1280 ? "100%" : "calc(100% - 80px)"}
        opened={openDisplayCase}
        onClose={() => setopenDisplayCase(false)}
        title={
          <Title
            order={5}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "600",
              color: "dodgerblue",
            }}
          >
            <BsFillExclamationOctagonFill
              size={18}
              style={{ marginRight: 8 }}
            />{" "}
            {selectedData?.status === "sans-suite"
              ? "Cas non identifié"
              : `Cas de fraude Nº ${selectedData?.code}`}
          </Title>
        }
      >
        <DisplayFraudCase data={selectedData} />
      </Drawer>

      <Modal
        opened={openNewCase}
        size={500}
        onClose={() => setopenNewCase(false)}
        title={
          <Title
            order={5}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "600",
              color: "dodgerblue",
            }}
          >
            <BsQuestionOctagonFill size={18} style={{ marginRight: 8 }} />{" "}
            Nouveau cas suspect
          </Title>
        }
      >
        <FormSignal
          status="create"
          category="regular"
          handleClose={() => setopenNewCase(false)}
        />
      </Modal>

      <Modal
        opened={transfer}
        onClose={() => settransfer(false)}
        title={
          <Title
            order={5}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "400",
              color: "dodgerblue",
            }}
          >
            <FaRegShareSquare size={20} style={{ marginRight: 8 }} /> Transférer
            du dossier vers CNLFM Provinciale
          </Title>
        }
      >
        <FormTransfert
          status="create"
          handleClose={() => settransfer(false)}
          data={selectedData}
        />
      </Modal>

      <Modal
        opened={cloture}
        onClose={() => setcloture(false)}
        title={
          <Title
            order={5}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "600",
              color: "dodgerblue",
            }}
          >
            <FaLock size={18} style={{ marginRight: 8 }} /> Instruire le dossier
            de fraude
          </Title>
        }
      >
        <FormConclusion
          data={selectedData}
          handleClose={() => setcloture(false)}
        />
      </Modal>

      <Modal
        opened={clotureinsito}
        onClose={() => setclotureinsito(false)}
        title={
          <Title
            order={5}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "600",
              color: "dodgerblue",
            }}
          >
            <FaLock size={18} style={{ marginRight: 8 }} /> Instruction et
            décision provisoire sur site
          </Title>
        }
      >
        <FormConclusionInsito
          data={selectedData}
          handleClose={() => setclotureinsito(false)}
        />
      </Modal>

      <Modal
        opened={appel}
        onClose={() => setAppel(false)}
        title={
          <Title
            order={5}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "400",
              color: "dodgerblue",
            }}
          >
            <BsFolderPlus size={20} style={{ marginRight: 8 }} /> Pour fixation
          </Title>
        }
      >
        <FormAppel
          status="create"
          handleClose={() => setAppel(false)}
          data={selectedData}
        />
      </Modal>

      <Modal
        opened={executionInsito}
        onClose={() => setexecutionInsito(false)}
        title={
          <Title
            order={5}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "400",
              color: "dodgerblue",
            }}
          >
            <BsFolderPlus size={20} style={{ marginRight: 8 }} /> Aprés
            exécution de la décision
          </Title>
        }
      >
        <FormExecution
          status="create"
          handleClose={() => setexecutionInsito(false)}
          data={selectedData}
        />
      </Modal>

      <Modal
        opened={execution}
        onClose={() => setExecution(false)}
        title={
          <Title
            order={5}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "400",
              color: "dodgerblue",
            }}
          >
            <BsFolderPlus size={20} style={{ marginRight: 8 }} /> Aprés
            exécution de la décision
          </Title>
        }
      >
        <FormExecution
          status="create"
          handleClose={() => setExecution(false)}
          data={selectedData}
        />
      </Modal>

      <Modal
        opened={archive}
        onClose={() => setArchive(false)}
        title={
          <Title
            order={5}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "400",
              color: "dodgerblue",
            }}
          >
            <BsArchive size={20} style={{ marginRight: 8 }} /> Cloture
            définitive du dossier et archivage
          </Title>
        }
      >
        <FormArchive
          status="create"
          handleClose={() => setArchive(false)}
          data={selectedData}
        />
      </Modal>

      <Modal
        opened={orientation}
        onClose={() => setorientation(false)}
        title={
          <Title
            order={5}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "400",
              color: "dodgerblue",
            }}
          >
            <BsBoxArrowInDownRight size={20} style={{ marginRight: 8 }} />{" "}
            Orienter le dossier pour instruction
          </Title>
        }
      >
        <FormOrientation
          status="edit"
          handleClose={() => setorientation(false)}
          data={selectedData}
        />
      </Modal>
    </div>
  );
}

export default FraudCases;
