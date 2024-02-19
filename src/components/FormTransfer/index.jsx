import { Button, Modal, Textarea, Title } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import React, { useState } from "react";
import { FaRegSave, FaUserCog } from "react-icons/fa";
import { useDispatch } from "react-redux";
import * as yup from "yup";

import { DatePicker } from "@mantine/dates";
import { BsCheck2, BsFilesAlt, BsTruck, BsXLg } from "react-icons/bs";
import { GiMinerals } from "react-icons/gi";
import { updateFraud } from "../../redux/slices/fraud_cases";
import FormMoyen from "../FormMoyen";
import FormPv from "../FormPV";
import FormPrevenu from "../FormPrevenu";
import FormSubstance from "../FormSubstance";

const createTransferSchema = yup.object().shape({
  observation: yup.string().required("champ obligatoire"),
  reception_date: yup.date().required("champ obligatoire"),
  transfer_date: yup.date().required("champ obligatoire"),
});

function FormTransfer({ data, handleClose }) {
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);

  const [files, setfiles] = useState(false);
  const [substances, setsubstances] = useState(false);
  const [prevenu, setprevenu] = useState(false);
  const [moyen, setmoyen] = useState(false);

  const form = useForm({
    validate: yupResolver(createTransferSchema),
    initialValues: {
      observation: "",
      reception_date: new Date(),
      transfer_date: new Date(),
    },
  });

  async function handleSubmit(values, e) {
    e.preventDefault();
    setloading(true);

    const res = await dispatch(
      updateFraud({
        _id: data._id,
        dataToSubmit: {
          reception: { ...values, isComplete: true },
          action: "transfer",
          status: "transferred",
        },
      })
    );
    if (res.payload) {
      handleClose();
      return showNotification({
        color: "green",
        title: "Reussite",
        message: "Enregistrement reussi",
        icon: <BsCheck2 size={24} />,
      });
    }
    setloading(false);

    return showNotification({
      color: "orange",
      title: "Erreur",
      message: "Erreur de l'enregistrement!!",
      icon: <BsXLg size={26} />,
    });
  }

  return (
    <div style={{ borderTop: "1px solid #eaeaea", marginTop: -8 }}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="dates">
          <DatePicker
            variant="filled"
            size="sm"
            className="textinput"
            description="Date de transfert du cas :"
            style={{ width: "49%" }}
            {...form.getInputProps("transfer_date")}
          />
          <DatePicker
            variant="filled"
            size="sm"
            className="textinput"
            description="Date de réception du dossier :"
            style={{ width: "49%" }}
            {...form.getInputProps("reception_date")}
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
            description="Parlez brievement des raisons du transfer de ce cas."
            placeholder="Observation breve du cas suspect..."
            autosize
            minRows={2}
            maxRows={4}
          />
        </div>
        <div className="dates">
          <Button
            variant="outline"
            color="teal"
            onClick={() => setprevenu(true)}
            fullWidth
          >
            Ajouter un prevenu au dossier
          </Button>
        </div>
        <div className="dates">
          <Button
            variant="outline"
            color="cyan"
            onClick={() => setmoyen(true)}
            fullWidth
          >
            Ajouter un moyen de fraude
          </Button>
        </div>
        <div className="dates">
          <Button
            variant="outline"
            color="teal"
            onClick={() => setfiles(true)}
            fullWidth
          >
            Importer un fichier dans le dossier
          </Button>
        </div>
        <div className="dates">
          <Button
            variant="outline"
            color="cyan"
            onClick={() => setsubstances(true)}
            fullWidth
          >
            Ajouter une substances minérales
          </Button>
        </div>
        <div
          style={{
            float: "right",
            display: "inline-flex",
            alignItems: "center",
            marginTop: 28,
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
        opened={files}
        onClose={() => setfiles(false)}
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
          </Title>
        }
      >
        <FormPv
          status="create"
          data={data}
          handleClose={() => setfiles(false)}
        />
      </Modal>
      <Modal
        opened={substances}
        onClose={() => setsubstances(false)}
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
            <GiMinerals size={20} style={{ marginRight: 8 }} /> Nouvelle
            substance minérale
          </Title>
        }
      >
        <FormSubstance
          status="create"
          data={data}
          handleClose={() => setsubstances(false)}
        />
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
            <FaUserCog size={20} style={{ marginRight: 8 }} /> Nouveau prevenu
          </Title>
        }
      >
        <FormPrevenu
          status="create"
          data={data}
          handleClose={() => setprevenu(false)}
        />
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
            <BsTruck size={20} style={{ marginRight: 8 }} /> Nouveau moyen
          </Title>
        }
      >
        <FormMoyen
          status="create"
          data={data}
          handleClose={() => setmoyen(false)}
        />
      </Modal>
    </div>
  );
}

export default FormTransfer;
