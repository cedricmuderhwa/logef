import { yupResolver } from "@hookform/resolvers/yup";
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Grid,
  Loader,
  PasswordInput,
  Popover,
  Progress,
  Switch,
  Text,
  TextInput,
  createStyles,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  BsCheck2,
  BsCheck2Circle,
  BsCheckLg,
  BsClockHistory,
  BsGear,
  BsShieldFillCheck,
  BsShieldLockFill,
  BsUnlockFill,
  BsX,
} from "react-icons/bs";
import { FaRegSave, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { LoadLogs } from "../../hooks/fetchLogs";
import { LoadRegions } from "../../hooks/fetchRegion";
import { LoadSessions } from "../../hooks/fetchSessions";
import {
  changePassword,
  checkPassword,
  updateUserProfile,
} from "../../redux/slices/sessions";

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
  },

  input: {
    height: "auto",
    paddingTop: 18,
  },

  label: {
    position: "absolute",
    pointerEvents: "none",
    fontSize: theme.fontSizes.xs,
    paddingLeft: theme.spacing.sm,
    paddingTop: theme.spacing.sm / 2,
    zIndex: 1,
  },
}));

const updateUserSchema = yup.object().shape({
  first_name: yup.string().min(2).max(120).optional(),
  last_name: yup.string().min(2).max(120).optional(),
  email: yup.string().email("not a valid email").max(50).optional(),
  phone: yup.string().min(10).max(18).optional(),
  isActive: yup.boolean().optional(),
  isAvailable: yup.boolean().optional(),
});

function PasswordRequirement({ meets, label }) {
  return (
    <Text
      color={meets ? "teal" : "red"}
      sx={{ display: "flex", alignItems: "center" }}
      mt={7}
      size="sm"
    >
      {meets ? <BsCheckLg size={14} /> : <BsX size={14} />}{" "}
      <Box ml={10}>{label}</Box>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: "Includes number" },
  { re: /[a-z]/, label: "Includes lowercase letter" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
];

function getStrength(password) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

function Settings() {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);
  const [loadingPwd, setloadingPwd] = useState(false);
  const [isAuth, setIsAuth] = useState("pending");

  const [loadingLogs, logsList] = LoadLogs();
  const [loadingSession, sessionList] = LoadSessions();

  const [user, setuser] = useState();
  const userAuth = useSelector((state) => state.sessions.authUser);
  const [verifying, setverifying] = useState(false);

  const [popoverOpened, setPopoverOpened] = useState(false);
  const [valuePwd, setValuePwd] = useState("");
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(valuePwd)}
    />
  ));

  const strength = getStrength(valuePwd);
  const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      first_name: userAuth?.first_name,
      last_name: userAuth?.last_name,
      phone: userAuth?.phone,
      email: userAuth?.email,
      isActive: userAuth?.isActive,
      isAvailable: userAuth?.isAvailable,
    },
    resolver: yupResolver(updateUserSchema),
  });

  LoadRegions();

  useEffect(() => {
    setuser(userAuth);

    reset({
      first_name: userAuth?.first_name,
      last_name: userAuth?.last_name,
      phone: userAuth?.phone,
      email: userAuth?.email,
      isActive: userAuth?.isActive,
      isAvailable: userAuth?.isAvailable,
    });
  }, [userAuth, reset]);

  const pwdInputRef = useRef();

  function onSubmit(values, e) {
    e.preventDefault();
    setloading(true);
    dispatch(
      updateUserProfile({ _id: userAuth?._id, dataToSubmit: values })
    ).then((res) => {
      if (res.payload) {
        showNotification({
          color: "green",
          title: "Success",
          message: "User updated successfully",
          icon: <BsCheck2 />,
        });
        setloading(false);
      }

      if (res.error) {
        showNotification({
          color: "red",
          title: "Failed",
          message: "Error updating user",
          icon: <FaTimes />,
        });
        setloading(false);
      }
    });
  }

  const handleValidatePwd = (e) => {
    const data = pwdInputRef?.current.value;
    setverifying(true);
    setTimeout(async () => {
      const res = await dispatch(checkPassword({ password: data }));
      if (res?.payload?.success) {
        setIsAuth("success");
      }

      if (!res?.payload.success) {
        setIsAuth("failed");
        setTimeout(() => {
          setIsAuth("pending");
        }, 1500);
      }
      setverifying(false);
    }, 1000);
  };

  function onChangePwd(values) {
    setloadingPwd(true);

    setTimeout(async () => {
      const res = await dispatch(
        changePassword({
          password: values?.password,
          passwordConfirmation: values?.passwordConfirmation,
        })
      );

      if (res?.payload === undefined) {
        showNotification({
          color: "red",
          title: "Echec",
          message: "Les mots de passe ne concordent pas, réessayez svp!!",
          icon: <BsX size={26} />,
        });
      }

      if (res?.payload === "Created") {
        setIsAuth("pending");
        setValuePwd("");
        setValue("password", "");
        setValue("passwordConfirmation", "");
        setValue("current-pwd", "");
        showNotification({
          color: "green",
          title: "Success",
          message: "Password Updated successfully",
          icon: <BsCheck2 size={26} />,
        });
      }
      setloadingPwd(false);
    }, 1000);
  }

  return (
    <div
      style={{
        padding: "6px 10px",
        width: "100%",
        backgroundColor: "#fff",
        // height: "99.4vh",
      }}
    >
      <Grid
        gutter={14}
        style={{
          padding: "8px 4px",
          marginBottom: 14,
        }}
      >
        <Grid.Col
          xs={12}
          sm={12}
          md={12}
          lg={5}
          xl={5}
          style={{
            border: "1px solid #eaeaea",
            borderRadius: 4,
            padding: "4px 14px",
            height: "fit-content",
          }}
        >
          <Grid gutter="sm">
            <div className="headerMainPage">
              <p
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: 16,
                  color: "dodgerblue",
                  fontWeight: "bold",
                }}
              >
                <BsGear fontSize={18} style={{ marginRight: 8 }} /> Paramètres
              </p>
            </div>
          </Grid>
          <Divider />
          <Text size="xs" color="dimmed">
            Vous avez la possibilité de mettre à jour toute information générale
            relative à votre compte.
          </Text>

          <Grid gutter="lg" style={{ marginTop: 14, marginBottom: 24 }}>
            <Grid.Col
              xs={12}
              sm={4}
              md={4}
              lg={4}
              xl={4}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #eaeaea",
                borderRadius: 8,
              }}
            >
              <Avatar color="blue" size={74} radius="50%">
                {user?.first_name[0]}
                {user?.last_name[0]}
              </Avatar>
              <div style={{ textAlign: "center", marginTop: 4 }}>
                <Text size="md">
                  {user?.first_name.concat(" ", user?.last_name)}
                </Text>
                <Text size="sm" color="blue">
                  {user?.user_role}
                </Text>
                <Divider style={{ marginBlock: 7 }} />
                <Text size="xs" color="dimmed">
                  {user?.email}
                </Text>
                <Text size="xs" color="dimmed">
                  {user?.phone}
                </Text>
                <Divider style={{ marginBlock: 7 }} />
                <Badge radius="xs" color={user?.isAvailable ? "green" : "gray"}>
                  {user?.isAvailable ? "Disponible" : "Indisponible"}
                </Badge>
              </div>
            </Grid.Col>
            <Grid.Col
              xs={12}
              sm={8}
              md={8}
              lg={8}
              xl={8}
              style={{ paddingInline: 8 }}
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="dates" style={{ marginTop: -5 }}>
                  <TextInput
                    label="First Name"
                    placeholder="Input users's first name"
                    size="xs"
                    classNames={classes}
                    style={{
                      width: window.innerWidth <= 500 ? "100%" : "49%",
                      marginBottom: window.innerWidth <= 500 ? 8 : null,
                    }}
                    key="first_name"
                    {...register("first_name")}
                    onChange={(e) =>
                      setValue("first_name", e.target.value, {
                        shouldValidate: true,
                      })
                    }
                    error={
                      errors.first_name ? (
                        <span id="error">{errors.first_name?.message}</span>
                      ) : null
                    }
                  />
                  <TextInput
                    label="Last Name"
                    size="xs"
                    placeholder="Input users's last name"
                    classNames={classes}
                    style={{ width: window.innerWidth <= 500 ? "100%" : "49%" }}
                    key="last_name"
                    {...register("last_name")}
                    onChange={(e) =>
                      setValue("last_name", e.target.value, {
                        shouldValidate: true,
                      })
                    }
                    error={
                      errors.last_name ? (
                        <span id="error">{errors.last_name?.message}</span>
                      ) : null
                    }
                  />
                </div>
                <div className="dates" style={{ marginTop: 18 }}>
                  <TextInput
                    label="Email"
                    size="xs"
                    placeholder="user email"
                    classNames={classes}
                    style={{
                      width: window.innerWidth <= 500 ? "100%" : "49%",
                      marginBottom: window.innerWidth <= 500 ? 8 : null,
                    }}
                    key="email"
                    {...register("email")}
                    onChange={(e) =>
                      setValue("email", e.target.value, {
                        shouldValidate: true,
                      })
                    }
                    error={
                      errors.email ? (
                        <span id="error">{errors.email?.message}</span>
                      ) : null
                    }
                  />
                  <TextInput
                    label="Telephone"
                    size="xs"
                    placeholder="Telephone"
                    classNames={classes}
                    style={{ width: window.innerWidth <= 500 ? "100%" : "49%" }}
                    key="phone"
                    {...register("phone")}
                    onChange={(e) =>
                      setValue("phone", e.target.value, {
                        shouldValidate: false,
                      })
                    }
                    error={
                      errors?.phone ? (
                        <span id="error">{errors?.phone?.message}</span>
                      ) : null
                    }
                  />
                </div>
                <div className="dates" style={{ marginTop: 24 }}>
                  <Switch
                    size="xs"
                    color="blue"
                    label="Disponible"
                    onLabel="OUI"
                    offLabel="NON"
                    key="isAvailable"
                    {...register("isAvailable", { type: "checkbox" })}
                    onTouchEnd={(e) =>
                      setValue("isAvailable", e.target.value, {
                        shouldValidate: true,
                      })
                    }
                  />
                </div>
                <div className="dates">
                  <Switch
                    size="xs"
                    color="blue"
                    label="Compte actif"
                    onLabel="NON"
                    offLabel="OUI"
                    disabled
                    key="isActive"
                    {...register("isActive", { type: "checkbox" })}
                    onChange={(e) =>
                      setValue("isActive", e.target.value, {
                        shouldValidate: true,
                      })
                    }
                  />
                </div>
                <div
                  style={{
                    float: "right",
                    display: "inline-flex",
                    alignItems: "center",
                    marginTop: -48,
                  }}
                >
                  <Button
                    loading={loading}
                    leftIcon={<FaRegSave />}
                    type="submit"
                    color="blue"
                    size="xs"
                    compact
                  >
                    Mettre à jour
                  </Button>
                </div>
              </form>
            </Grid.Col>
          </Grid>

          <Text color="blue" weight={600}>
            <BsShieldLockFill size={16} style={{ marginBottom: -2 }} /> Changer
            de mot de passe
          </Text>
          <Divider />
          <Grid>
            <Grid.Col span={12}>
              <Text size="xs" color="dimmed" style={{ marginBottom: 4 }}>
                Vous devez vous assurer que votre mot de passe n'est connu que
                de vous. Ne partagez pas votre mot de passe personnel avec qui
                que ce soit.
              </Text>
              <form onSubmit={handleSubmit(onChangePwd)}>
                <div className="dates" style={{ width: "100%" }}>
                  <TextInput
                    type="password"
                    autoComplete="off"
                    ref={pwdInputRef}
                    variant="filled"
                    size="xs"
                    id="current_password"
                    label="Mot de passe en cours :"
                    style={{ width: window.innerWidth <= 500 ? "100%" : "49%" }}
                    required
                    rightSection={
                      verifying ? (
                        <Loader color="blue" size="sm" />
                      ) : (
                        <ActionIcon
                          color="blue"
                          size="sm"
                          variant="outline"
                          onClick={() => handleValidatePwd()}
                        >
                          <BsUnlockFill />
                        </ActionIcon>
                      )
                    }
                  />
                  {isAuth === "success" ? (
                    <Badge
                      radius="sm"
                      color="green"
                      size="md"
                      style={{
                        width: window.innerWidth <= 500 ? "100%" : "49%",
                        marginTop: window.innerWidth <= 500 ? 8 : null,
                        marginBottom: 2,
                      }}
                    >
                      <BsCheck2Circle
                        size={22}
                        style={{ marginRight: 4, marginBottom: -6 }}
                      />{" "}
                      Verifié
                    </Badge>
                  ) : isAuth === "failed" ? (
                    <Badge
                      radius="sm"
                      color="red"
                      size="md"
                      style={{
                        width: window.innerWidth <= 500 ? "100%" : "49%",
                        marginTop: window.innerWidth <= 500 ? 8 : null,
                        marginBottom: 2,
                      }}
                    >
                      <BsX
                        size={18}
                        style={{ marginRight: 4, marginBottom: -6 }}
                      />{" "}
                      Echoué
                    </Badge>
                  ) : null}
                </div>

                <div
                  style={{
                    width: "100%",
                    display: "inline-flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  {/* <div style={{width: '49%'}}>
                                <PasswordInput
                                    value={valuePwd}
                                    key='first_name' {...register('password')}
                                    onChange={(e) => {
                                        setValue('password', e.target.value, { shouldValidate: false})
                                        setValuePwd(e.target.value)
                                    }}
                                    error={errors.password ? <span id="error">{errors.password?.message}</span> : null}
                                    placeholder="Votre nouveau mot de passe"
                                    label="Nouveau mot de passe"
                                    disabled={!(isAuth === 'success')}
                                    required
                                />
                                <Group spacing={5} grow mt="xs" mb="md">
                                    {bars}
                                </Group>

                                <PasswordRequirement label="Au moins 6 caractères" meets={valuePwd.length > 5} />
                                {checks}
                            </div> */}
                  <div
                    style={{ width: window.innerWidth <= 500 ? "100%" : "49%" }}
                  >
                    <Popover
                      opened={popoverOpened}
                      position="bottom"
                      width="target"
                      transition="pop"
                    >
                      <Popover.Target>
                        <div
                          onFocusCapture={() => setPopoverOpened(true)}
                          onBlurCapture={() => setPopoverOpened(false)}
                        >
                          <PasswordInput
                            value={valuePwd}
                            autoComplete="off"
                            key="password"
                            style={{
                              width: "100%",
                            }}
                            size="xs"
                            {...register("password")}
                            onChange={(e) => {
                              setValue("password", e.target.value, {
                                shouldValidate: false,
                              });
                              setValuePwd(e.target.value);
                            }}
                            error={
                              errors.password ? (
                                <span id="error">
                                  {errors.password?.message}
                                </span>
                              ) : null
                            }
                            placeholder="Votre nouveau mot de passe"
                            label="Nouveau mot de passe"
                            disabled={!(isAuth === "success")}
                            required
                          />
                        </div>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <Progress
                          color={color}
                          value={strength}
                          size={5}
                          style={{ marginBottom: 10 }}
                        />
                        <PasswordRequirement
                          label="Includes at least 6 characters"
                          meets={valuePwd.length > 5}
                        />
                        {checks}
                      </Popover.Dropdown>
                    </Popover>
                  </div>

                  <div
                    style={{ width: window.innerWidth <= 500 ? "100%" : "49%" }}
                  >
                    <PasswordInput
                      variant="filled"
                      autoComplete="off"
                      size="xs"
                      style={{
                        width: "100%",
                      }}
                      label="Confirmer votre mot de passe"
                      key="passwordConfirmation"
                      {...register("passwordConfirmation")}
                      onChange={(e) =>
                        setValue("passwordConfirmation", e.target.value, {
                          shouldValidate: false,
                        })
                      }
                      error={
                        errors.first_name ? (
                          <span id="error">{errors.first_name?.message}</span>
                        ) : null
                      }
                      required
                      disabled={!(isAuth === "success")}
                      defaultValue={valuePwd}
                    />
                  </div>
                </div>

                <div
                  style={{
                    float: "right",
                    display: "inline-flex",
                    alignItems: "center",
                    marginTop: 14,
                    marginBottom: 14,
                  }}
                >
                  <Button
                    disabled={!(isAuth === "success")}
                    loading={loadingPwd}
                    leftIcon={<FaRegSave />}
                    type="submit"
                    color="blue"
                    size="xs"
                    compact
                  >
                    Enregistrer
                  </Button>
                </div>
              </form>
            </Grid.Col>
          </Grid>
        </Grid.Col>

        {window.innerWidth <= 768 ? null : (
          <Grid.Col
            xs={12}
            sm={12}
            md={12}
            lg={7}
            xl={7}
            style={{
              // border: "1px solid #eaeaea",
              borderRadius: 4,
              padding: "5px 14px",
              height: "fit-content",
            }}
          >
            <Grid gutter="sm">
              <div className="headerMainPage">
                <p
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    fontSize: 16,
                    color: "dodgerblue",
                    fontWeight: "bold",
                  }}
                >
                  <BsClockHistory fontSize={18} style={{ marginRight: 8 }} />{" "}
                  Journaux d'activité des affaires de la fraude
                </p>
              </div>
            </Grid>
            <Divider />
            <Text size="xs" color="dimmed" style={{ marginBottom: 14 }}>
              Cette section énumère toutes les activités récentes sur les cas de
              fraude dans la région actuelle sans aucun détail majeur.
            </Text>
            {loadingLogs ? (
              <div style={{ width: "100%", height: "40vh" }}>
                En cours de chargement...
              </div>
            ) : (
              <div>
                {logsList
                  ?.slice(0)
                  ?.reverse()
                  ?.map((session) => (
                    <div
                      key={session._id}
                      style={{
                        width: "100%",
                        marginBlock: 1,
                        display: "inline-flex",
                        alignItems: "center",
                        borderBlock: "0.5px solid #eaeaea",
                      }}
                    >
                      <Badge
                        variant="light"
                        radius="sm"
                        color="blue"
                        style={{ marginRight: 8 }}
                      >
                        {session.createdAt
                          .substring(0, 10)
                          .concat(" ", session.createdAt.substring(11, 19))}
                      </Badge>
                      <Text size="xs" color="dimmed">
                        {session.title}
                      </Text>
                    </div>
                  ))}
              </div>
            )}

            <Grid gutter="sm" style={{ marginTop: 14 }}>
              <div className="headerMainPage">
                <p
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    fontSize: 16,
                    color: "dodgerblue",
                    fontWeight: "bold",
                  }}
                >
                  <BsShieldFillCheck fontSize={18} style={{ marginRight: 8 }} />{" "}
                  Historique des activités de votre compte
                </p>
              </div>
            </Grid>
            <Divider />
            <Text size="xs" color="dimmed" style={{ marginBottom: 14 }}>
              Vous pouvez consulter l'historique de vos dernières connexions et
              l'agent que vous avez utilisé.
            </Text>
            {loadingSession ? (
              <div style={{ width: "100%", height: "40vh" }}>
                En cours de chargement...
              </div>
            ) : (
              <div>
                {sessionList
                  ?.slice(0)
                  ?.reverse()
                  ?.map((session) => (
                    <div
                      key={session._id}
                      style={{
                        width: "100%",
                        marginBlock: 1,
                        display: "inline-flex",
                        alignItems: "center",
                        borderBlock: "0.5px solid #eaeaea",
                      }}
                    >
                      <Badge
                        variant="light"
                        radius="sm"
                        color="blue"
                        style={{ marginRight: 8 }}
                      >
                        {session.createdAt
                          .substring(0, 10)
                          .concat(" ", session.createdAt.substring(11, 19))}
                      </Badge>
                      <Text size="xs" color="dimmed">
                        {session.userAgent.split(")")[0].concat(")")}
                      </Text>
                    </div>
                  ))}
              </div>
            )}
          </Grid.Col>
        )}
      </Grid>
    </div>
  );
}

export default Settings;
