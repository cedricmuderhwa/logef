import { Button, Divider, Select, Textarea, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import React, { useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { useDispatch } from "react-redux";
import * as yup from "yup";

import { DatePicker } from "@mantine/dates";
import { BsCheck2, BsXLg } from "react-icons/bs";
import { updateFraud } from "../../redux/slices/fraud_cases";

const createConclusionSchema = yup.object().shape({
  date: yup.date().required("champ obligatoire"),
  observation: yup.string().required("champ obligatoire"),
  no_decision: yup.string().required("champ obligatoire"),
  amende: yup.string().optional(),
  decision: yup.string().required("champ obligatoire"),
});

function FormConclusion({ data, handleClose }) {
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);
  const [decision, setdecision] = useState("concluded_restitution_sans_amende");

  const form = useForm({
    validate: yupResolver(createConclusionSchema),
    initialValues: {
      date: new Date(),
      observation: "",
      no_decision: "",
      amende: "",
      decision: "",
    },
  });

  async function handleSubmit(values, e) {
    e.preventDefault();
    setloading(true);

    const res = await dispatch(
      updateFraud({
        _id: data?._id,
        dataToSubmit: {
          conclusion: {
            ...values,
            decision: values.decision,
            isComplete: true,
          },
          action: "conclusion",
          status: values.decision,
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
      message: "Echec de l'enregistrement!!",
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
            label="Date d'instruction du dossier :"
            className="textinput"
            description="Sélectionner la date à laquelle le dossier a été instruit :"
            style={{ width: "100%" }}
            {...form.getInputProps("date")}
          />
        </div>
        <div className="dates">
          <Select
            data={[
              {
                label: "Réstitution au fraudeur (propriétaire) avec amendes",
                value: "concluded_restitution_avec_amende",
              },
              {
                label: "Réstitution au fraudeur (propriétaire) sans amendes",
                value: "concluded_restitution_sans_amende",
              },
              {
                label: "Réstitution au propriétaire légal (cas de vol)",
                value: "concluded_restitution_legal",
              },
              {
                label: "Confiscation (patrimoine de l'Etat Congolais)",
                value: "concluded_confiscation",
              },
            ]}
            variant="filled"
            size="sm"
            label="Décision apres instruction :"
            className="textinput"
            description="Une fois le dossier instruit, la décision est soit la confiscation, soit la réstitution des substances. "
            style={{ width: "100%" }}
            onSelect={(e) => setdecision(form.values.decision)}
            {...form.getInputProps("decision")}
          />
        </div>
        {decision === "concluded_restitution_avec_amende" ? (
          <div className="dates">
            <TextInput
              variant="filled"
              size="sm"
              label="Amendes à payer :"
              className="textinput"
              description="Le cas est conclu par restitution des substances moyennant une amende, inserez le montant un USD:  "
              style={{ width: "100%" }}
              {...form.getInputProps("amende")}
            />
          </div>
        ) : null}
        <div className="dates">
          <TextInput
            variant="filled"
            size="sm"
            description="Numero de la decision :"
            className="textinput"
            style={{ width: "100%" }}
            {...form.getInputProps("no_decision")}
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
            description="Parlez brievement de la conclusion du cas en cours."
            placeholder="Parlez brievement..."
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
    </div>
  );
}

export default FormConclusion;
