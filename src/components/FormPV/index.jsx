import { Button, Divider, FileInput, Select, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import React, { useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { useDispatch } from "react-redux";
import * as yup from "yup";

import Axios from "axios";
import { useRef } from "react";
import { BsCheck2, BsXLg } from "react-icons/bs";
import { findSelected } from "../../redux/slices/current";
import { updateFraud } from "../../redux/slices/fraud_cases";

const createPvSchema = yup.object().shape({
  category: yup.string().required("champ obligatoire"),
  file_no: yup.string().required("champ obligatoire"),
  file_url: yup.string().required("champ obligatoire"),
});

const tracabilityDocs = [
  "Carte d'électeur ou passeport",
  "Statut carte d'exploitant artisanal(creuseur)",
  "Statut carte de négociant",
  "Agrément comme comptoir",
  "Agrément comme coopérative",
  "Agrément comme entité de traitement ou de transformation",
  "Autres agrément",
  "Autres titre minier",
  "Permis d'exploitation (PE)",
  "Permis d'exploitation de rejet (PER)",
  "Permis d'exploitation de la petite mine (PEPM)",
  "Permis de recherche (PR)",
  "Autorisation d'exploitation",
  "Logbook site minier",
  "Logbook négociant",
  "Logbook comptoir",
  "Attestation de transport",
  "Fiche ou formulaire de transfert",
  "Bon d'achat du CEEC",
  "Certificat d'origine à l'exportation",
  "Certificat CIRGL",
  "Certificat de Kimberley",
];

const instructionDocs = [
  "Note technique de constat des faits",
  "Procés verbal de constat des faits",
  "Procés verbal d'audition",
  "Procés verbal de saisi d'objets",
  "Procés verbal de consignation d'objets",
  "Procés verbal de saisi des prevenus",
  "Rapport d'analyse des substances",
  "Procés verbal de gardiennage",
  "Décision d'instruction",
];

const executionDocs = [
  "Jugement",
  "Arret",
  "Procés verbal de réstitution",
  "Acte de réconnaissance",
  "Acte de vente",
  "Rapport de cloture",
];

function FormPv({ data, category, handleClose }) {
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);

  const fileUrl = useRef();

  const form = useForm({
    validate: yupResolver(createPvSchema),
    initialValues: {
      category: "",
      file_no: "",
      file_url: "",
    },
  });

  async function handleSubmit(values, e) {
    e.preventDefault();
    setloading(true);

    const formData = new FormData();

    formData.append("file", values.file_url);
    formData.append("upload_preset", "ml_default");

    await showNotification({
      id: "load-data",
      loading: true,
      color: "blue",
      title: "Chargement du fichier en cours...",
      autoClose: false,
      disallowClose: true,
    });

    Axios.post("cloudinary://656155977323694:b5AKfjf-zPzeh-1LEsCiGm545Ks@de6x6wclk/image/upload", formData).then(
      async (response) => {
        if (response.data) {
          const dataToSubmit = {
            action: "add-files",
            field: category,
            category: values.category,
            file_no: values.file_no,
            file_url: response.data.secure_url,
          };

          await updateNotification({
            id: "load-data",
            color: "green",
            loading: true,
            title: "Enregistrement en cours...",
            disallowClose: true,
            autoClose: false,
          });

          const res = await dispatch(
            updateFraud({ _id: data?._id, dataToSubmit })
          );

          if (res.payload) {
            handleClose();

            await dispatch(findSelected(data?._id));

            return await updateNotification({
              id: "load-data",
              color: "green",
              title: "Réussite",
              message: "Enregistrement réussi!",
              icon: <BsCheck2 size={24} />,
              autoClose: 3000,
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
      }
    );
  }

  return (
    <div style={{ borderTop: "1px solid #eaeaea", marginTop: -8 }}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="dates">
          <Select
            data={
              category === "instruction"
                ? instructionDocs
                : category === "execution"
                ? executionDocs
                : tracabilityDocs
            }
            variant="filled"
            size="sm"
            label="Document relatif au cas :"
            className="textinput"
            description="Selectionnez le type de document à importer"
            style={{ width: "100%" }}
            searchable
            {...form.getInputProps("category")}
          />
        </div>
        <div className="dates">
          <TextInput
            variant="filled"
            size="sm"
            label="Doc Nº :"
            className="textinput"
            description="Inserez le numéro de réference du document à importer."
            style={{ width: "100%" }}
            {...form.getInputProps("file_no")}
          />
        </div>
        <div className="dates">
          <FileInput
            variant="filled"
            size="sm"
            style={{ width: "100%" }}
            placeholder="Sélectionner document que vous voulez importer"
            label="Fichier à importer :"
            ref={fileUrl}
            {...form.getInputProps("file_url")}
            withAsterisk
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

export default FormPv;
