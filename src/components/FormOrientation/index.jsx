import { Button, Divider, MultiSelect, Select, Textarea } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import React, { useState } from "react";
import { BsCheck2, BsXLg } from "react-icons/bs";
import { FaRegSave } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { LoadServices } from "../../hooks/fetchService";
import { updateFraud } from "../../redux/slices/fraud_cases";

const createOrientationSchema = yup.object().shape({
  classification: yup.string().required("champ obligatoire"),
  instruction: yup.string().required("champ obligatoire"),
  services_instructeur: yup
    .array(yup.string("champ obligatoire"))
    .required("champ obligatoire"),
  observation: yup.string().required("champ obligatoire"),
});

function FormOrientation({ data, handleClose }) {
  const dispatch = useDispatch();
  const services = useSelector((state) => state.services);
  const [loading, setloading] = useState(false);

  LoadServices();

  const form = useForm({
    validate: yupResolver(createOrientationSchema),
    initialValues: {
      classification: "",
      instruction: "",
      services_instructeur: [],
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

  async function handleSubmit(values, e) {
    e.preventDefault();
    setloading(true);

    const res = await dispatch(
      updateFraud({
        _id: data?._id,
        dataToSubmit: {
          orientation: { ...values, date: new Date(), isComplete: true },
          action: "oriented",
          status: "oriented",
        },
      })
    );

    if (res.payload) {
      handleClose();
      return showNotification({
        color: "green",
        title: "Réussite",
        message: "Enregistrement réussi!",
        icon: <BsCheck2 size={24} />,
      });
    }
    setloading(false);

    return showNotification({
      color: "red",
      title: "Erreur",
      message: "Echec de l'enregistrement...",
      icon: <BsXLg size={26} />,
    });
  }

  return (
    <div style={{ borderTop: "1px solid #eaeaea", marginTop: -8 }}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="dates">
          <Select
            data={[
              "Cas mineur à défaut d'encadrement",
              "Cas mineur à défaut de tracabilité",
              "Cas majeur non-sensible",
              "Cas majeur sensible",
              "Cas sensible des services de l'Etat",
              "Cas sensible des parténaires de l'Etat",
              "Autres cas",
            ]}
            variant="filled"
            size="sm"
            label="Categorisation du cas: "
            className="textinput"
            description="Le cas transferé est categorisé selon son dégré de sensiblité pour une instruction appropriée."
            style={{ width: "100%" }}
            {...form.getInputProps("classification")}
          />
        </div>
        <div className="dates">
          <Select
            data={[
              "Parquet Géneral",
              "Auditorat Militaire Supérieur",
              "Coordination provinciale du CNLFM",
              "Gouverneur",
              "Coordination Nationale du CNLFM",
            ]}
            size="sm"
            label="Orientation du dossier :"
            className="textinput"
            description="Le dossier est orienté vers le service qui sera  en charge de son instruction."
            style={{ width: "100%" }}
            {...form.getInputProps("instruction")}
          />
        </div>

        <div className="dates">
          <MultiSelect
            data={serviceList}
            size="sm"
            label="Service(s) chargé(s) du suivi du dossier :"
            className="textinput"
            description="Le dossier est instruit par un ou plusieurs  services. Cela peut etre un ou plusieurs services."
            style={{ width: "100%" }}
            {...form.getInputProps("services_instructeur")}
          />
        </div>

        <div className="dates" style={{ marginBottom: 14 }}>
          <Textarea
            {...form.getInputProps("observation")}
            label="Observation: "
            style={{ width: "100%" }}
            variant="filled"
            size="sm"
            className="textinput"
            description="Parlez brievement de la raison de cette orientation."
            placeholder="Parlez brievement..."
            autosize
            minRows={2}
            maxRows={5}
          />
        </div>
        <Divider />

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
    </div>
  );
}

export default FormOrientation;
