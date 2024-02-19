import {
  ActionIcon,
  Button,
  Divider,
  Modal,
  Select,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import React, { useState } from "react";
import { FaRegSave, FaUserCog, FaUserSecret } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import { DatePicker } from "@mantine/dates";
import { BsCheck2, BsPinMap, BsPlusLg, BsXLg } from "react-icons/bs";
import { LoadAgents } from "../../hooks/fetchAgent";
import { LoadServices } from "../../hooks/fetchService";
import { createFraud } from "../../redux/slices/fraud_cases";
import FormAgent from "../FormAgent";
import FormService from "../FormService";

const createSignalSchema = yup.object().shape({
  fraud_date: yup.date().required("champ obligatoire"),
  arrest_location: yup.string().required("champ obligatoire"),
  service: yup.string().required("champ obligatoire"),
  agent: yup.string().required("champ obligatoire"),
  provenance: yup.string().required("champ obligatoire"),
  destination: yup.string().required("champ obligatoire"),
  observation: yup.string().required("champ obligatoire"),
});

function FormSignal({ category, handleClose }) {
  const dispatch = useDispatch();
  const services = useSelector((state) => state.services);
  const userPermissions = useSelector(
    (state) => state.sessions.authUser
  ).permissions;

  const [loading, setloading] = useState(false);

  const [service, setservice] = useState(false);
  const [agent, setagent] = useState(false);

  LoadAgents();
  LoadServices();

  const form = useForm({
    validate: yupResolver(createSignalSchema),
    initialValues: {
      fraud_date: new Date(),
      arrest_location: "",
      service: "",
      agent: "",
      provenance: "",
      destination: "",
      observation: "",
    },
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

    if (category === "regular") {
      const dataToSubmit = {
        ...values,
        status: "signal",
      };

      setTimeout(() => {
        dispatch(createFraud({ dataToSubmit })).then((res) => {
          if (res.payload) {
            handleClose();
            showNotification({
              color: "green",
              title: "Succés",
              message: "Enregistrement reussi!",
              icon: <BsCheck2 size={18} />,
            });
            setloading(false);
          }

          if (res.error) {
            showNotification({
              color: "red",
              title: "Erreur",
              message: "Enregistrement echoué...",
              icon: <BsXLg size={18} />,
            });
            setloading(false);
          }
        });
      }, 1000);
    }
  }

  return (
    <div style={{ borderTop: "1px solid #eaeaea", marginTop: -8 }}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="dates">
          <DatePicker
            variant="filled"
            size="sm"
            label="Informations de base :"
            className="textinput"
            description="Date de constat de la fraude: "
            style={{ width: "49%" }}
            defaultValue={new Date()}
            {...form.getInputProps("fraud_date")}
          />
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Lieu de constat : "
            style={{ width: "49%" }}
            icon={<BsPinMap />}
            {...form.getInputProps("arrest_location")}
          />
        </div>
        <div className="dates">
          <Select
            data={serviceList}
            size="sm"
            className="textinput"
            description="Service aviseur"
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
        <div className="dates">
          <TextInput
            size="sm"
            className="textinput"
            description="Personne(s) aviseur"
            style={{ width: "90%" }}
            {...form.getInputProps("agent")}
          />
          <ActionIcon
            variant="filled"
            color="blue"
            size="lg"
            style={{ marginBottom: 1 }}
            onClick={() => setagent(true)}
            disabled={userPermissions?.ADD_ADVISOR ? false : true}
          >
            <BsPlusLg />
          </ActionIcon>
        </div>
        <div className="dates">
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Site de provenance :"
            style={{ width: "49%" }}
            {...form.getInputProps("provenance")}
          />
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Déstination :"
            style={{ width: "49%" }}
            {...form.getInputProps("destination")}
          />
        </div>

        <div className="dates">
          <Textarea
            {...form.getInputProps("observation")}
            label="Observation: "
            style={{ width: "100%" }}
            variant="filled"
            size="sm"
            className="textinput"
            description="Parlez brievement de votre observation personnelle du cas suspect."
            placeholder="Observation breve du cas suspect..."
            autosize
            minRows={2}
            maxRows={4}
          />
        </div>

        <Divider style={{ marginTop: 14 }} />

        <div
          style={{
            float: "right",
            display: "inline-flex",
            alignItems: "center",
            marginTop: 14,
          }}
        >
          <Button
            compact
            loading={loading}
            leftIcon={<FaRegSave size={18} />}
            type="submit"
            color="blue"
            size="sm"
          >
            Enregistrer
          </Button>
        </div>
      </form>

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

      <Modal
        opened={agent}
        onClose={() => setagent(false)}
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
            <FaUserSecret size={20} style={{ marginRight: 8 }} /> Nouvel hors
            système
          </Title>
        }
      >
        <FormAgent
          status="create"
          handleClose={(e) => {
            form.setFieldValue("agent", e.code);
            setagent(false);
          }}
        />
      </Modal>
    </div>
  );
}

export default FormSignal;
