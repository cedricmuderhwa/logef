import {
  ActionIcon,
  Button,
  Modal,
  Select,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import React, { useEffect, useState } from "react";
import {
  BsCheck2,
  BsExclamationLg,
  BsPinMapFill,
  BsPlusLg,
} from "react-icons/bs";
import { FaRegSave, FaUserCog } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { LoadRegions } from "../../hooks/fetchRegion";
import { LoadServices } from "../../hooks/fetchService";
import { createUser, updateUser } from "../../redux/slices/users";
import FormRegion from "../FormRegion";
import FormService from "../FormService";
import "./userform.scss";

const createUserSchema = yup.object().shape({
  first_name: yup.string().required("champ obligatoire").max(120),
  last_name: yup.string().required("champ obligatoire").max(120),
  user_role: yup.string().max(44),
  email: yup
    .string()
    .required("champ obligatoire")
    .email("email non valide")
    .max(50),
  quality: yup.string().max(120).required("champ obligatoire"),
  phone: yup.string().max(18).optional(),
  region: yup.string(),
  service: yup.string().required("champ obligatoire"),
});

function FormUser({ status, user, handleClose }) {
  const dispatch = useDispatch();
  LoadRegions();
  LoadServices();
  const regions = useSelector((state) => state.regions);
  const services = useSelector((state) => state.services);
  const loggedInUser = useSelector((state) => state.sessions.authUser);
  const [loading, setloading] = useState(false);
  const [region, setRegion] = useState(false);
  const [service, setservice] = useState(false);
  const userPermissions = useSelector(
    (state) => state.sessions.authUser
  ).permissions;

  const form = useForm({
    validate: yupResolver(createUserSchema),
    initialValues: {
      first_name: "",
      last_name: "",
      phone: "",
      service: "",
      email: "",
      quality: "",
      user_role: "",
      region: "",
    },
  });

  useEffect(() => {
    if (user !== null && status === "edit") {
      form.setValues({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        phone: user?.phone || "",
        email: user?.email || "",
        quality: user?.quality || "",
        user_role: user?.user_role || "",
        region: user?.region._id || "",
        service: user?.service._id || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, status, regions]);

  const regionList = !regions
    ? []
    : regions?.map((obj) => {
        return {
          label: obj.region,
          value: obj._id,
        };
      });

  const serviceList = !services
    ? []
    : services?.map((obj) => {
        return {
          label: obj.service_name,
          value: obj._id,
        };
      });

  function handleSubmit(values, e) {
    e.preventDefault();
    setloading(true);

    if (status === "create") {
      const dataToSubmit = {
        ...values,
        password: values.email.charAt(0).toUpperCase() + values.email.slice(1),
        passwordConfirmation:
          values.email.charAt(0).toUpperCase() + values.email.slice(1),
        isActive: true,
        user_role:
          loggedInUser?.user_role === "Admin provincial"
            ? "Point focal"
            : values?.user_role,
        region:
          loggedInUser?.user_role === "Admin provincial"
            ? loggedInUser?.region._id
            : values?.region,
        isAvailable: false,
      };

      setTimeout(() => {
        dispatch(createUser({ dataToSubmit })).then((res) => {
          if (res.payload) {
            handleClose();
            showNotification({
              color: "green",
              title: "Enregistrement réussi",
              message: "Creation de l'utlisateur reussi",
              icon: <BsCheck2 size={24} />,
            });
            setloading(false);
          }

          if (res.error) {
            setloading(false);
            showNotification({
              color: "red",
              title: "Erreur",
              message: "Une erreur s'est produite",
              icon: <BsExclamationLg />,
            });
          }
        });
      }, 1000);
    }

    if (status === "edit") {
      dispatch(
        updateUser({
          _id: user?._id,
          dataToSubmit: {
            ...values,
          },
        })
      ).then((res) => {
        if (res.payload) {
          handleClose();
          showNotification({
            color: "green",
            title: "Success",
            message: "User created successfully",
            icon: <BsCheck2 size={24} />,
          });
          setloading(false);
        }

        if (res.error) {
          setloading(false);
          showNotification({
            color: "red",
            title: "Erreur",
            message: "Quelque chose est arrivé...",
            icon: <BsExclamationLg />,
          });
        }
      });
    }
  }

  return (
    <div style={{ borderTop: "1px solid #eaeaea", marginTop: -8 }}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="dates">
          <TextInput
            variant="filled"
            size="sm"
            label={
              loggedInUser?.user_role === "Admin national"
                ? "Noms de l'utilisateur"
                : "Noms de l'utilisateur"
            }
            className="textinput"
            description="Nom :"
            style={{ width: "49%" }}
            key="first_name"
            {...form.getInputProps("first_name")}
          />
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Prénom :"
            style={{ width: "49%" }}
            key="last_name"
            {...form.getInputProps("last_name")}
          />
        </div>
        <div className="dates">
          <TextInput
            variant="filled"
            size="sm"
            label="Contacts :"
            className="textinput"
            description="Telephone :"
            style={{ width: "49%" }}
            key="phone"
            {...form.getInputProps("phone")}
          />
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Email :"
            style={{ width: "49%" }}
            key="email"
            {...form.getInputProps("email")}
          />
        </div>

        <div className="dates">
          <TextInput
            variant="filled"
            size="sm"
            label="Qualité de :"
            className="textinput"
            description="Qualité de l'utilisateur (par exemple : point focal, conseiller adjoint)."
            style={{ width: "100%" }}
            key="quality"
            {...form.getInputProps("quality")}
          />
        </div>

        <div className="dates" style={{ marginTop: 14 }}>
          <Select
            data={serviceList}
            size="sm"
            className="textinput"
            description={`Service membre de la CNLFM (${loggedInUser?.region?.region}) :`}
            style={{ width: "90%" }}
            {...form.getInputProps("service")}
          />
          <ActionIcon
            variant="filled"
            color="blue"
            size="lg"
            style={{ marginBottom: 1 }}
            onClick={() => setservice(true)}
            disabled={userPermissions?.ADD_MEMBER_SERVICE ? false : true}
          >
            <BsPlusLg />
          </ActionIcon>
        </div>

        {loggedInUser?.user_role === "Admin national" ? (
          <div className="dates">
            <Select
              data={regionList}
              size="sm"
              label="Région de l'utilisateur :"
              className="textinput"
              nothingFound="Nothing found"
              style={{ width: "89%" }}
              {...form.getInputProps("region")}
            />
            <ActionIcon
              variant="filled"
              color="blue"
              size="lg"
              style={{ marginBottom: 1 }}
              onClick={() => setRegion(true)}
              disabled={userPermissions?.ADD_REGION ? false : true}
            >
              <BsPlusLg />
            </ActionIcon>
          </div>
        ) : null}

        {loggedInUser?.user_role === "Admin national" ? (
          <div className="dates">
            <Select
              data={["Admin national", "Admin provincial"]}
              size="sm"
              label="Role de l'utilisateur :"
              description="L'utilisateur est definie par un ensemble des qualités lui donnant accés à certaines permissions"
              className="textinput"
              style={{ width: "100%" }}
              {...form.getInputProps("user_role")}
            />
          </div>
        ) : null}

        <div
          style={{
            float: "right",
            display: "inline-flex",
            alignItems: "center",
            marginTop: 28,
          }}
        >
          <Button
            loading={loading}
            leftIcon={<FaRegSave size={18} />}
            type="submit"
            color="blue"
            size="xs"
          >
            {status === "create" ? "Save" : "Save updates"}
          </Button>
        </div>
      </form>
      <Modal
        opened={region}
        onClose={() => setRegion(false)}
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
            <BsPinMapFill size={20} style={{ marginRight: 8 }} /> Créer une
            nouvelle region
          </Title>
        }
      >
        <FormRegion status="create" handleClose={() => setRegion(false)} />
      </Modal>

      <Modal
        opened={service}
        onClose={() => setservice(false)}
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
            <FaUserCog size={20} style={{ marginRight: 8 }} /> Nouveau service
          </Title>
        }
      >
        <FormService status="create" handleClose={() => setservice(false)} />
      </Modal>
    </div>
  );
}

export default FormUser;
