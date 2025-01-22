import { Button, Divider, FileInput, Textarea, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { showNotification, updateNotification  } from "@mantine/notifications";
import Axios from "axios";
import React, { useRef, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { useDispatch } from "react-redux";
import * as yup from "yup";

import { DatePicker } from "@mantine/dates";
import { BsCheck2, BsXLg } from "react-icons/bs";
import { LoadServices } from "../../hooks/fetchService";
import { findSelected } from "../../redux/slices/current";
import { updateFraud } from "../../redux/slices/fraud_cases";

const createArchiveSchema = yup.object().shape({
  date: new Date(),
  jugement_no: yup.date().required("champ obligatoire"),
  file_url: yup.string().required("champ obligatoire"),
  observation: yup.string().required("champ obligatoire"),
});

function FormArchive({ data, handleClose }) {
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);

  const fileUrl = useRef();

  LoadServices();

  const form = useForm({
    validate: yupResolver(createArchiveSchema),
    initialValues: {
      date: new Date(),
      jugement_no: "",
      file_url: "",
      observation: "",
    },
  });

  async function handleSubmit(values, e) {
    e.preventDefault();
    setloading(true);

    const formData = new FormData();

    formData.append("file", values.file_url);
    formData.append("upload_preset", "cedricmudex");

    await showNotification({
      id: "load-data",
      loading: true,
      color: "blue",
      title: "Chargement  en cours...",
      autoClose: false,
      disallowClose: true,
    });
    Axios.post("https://api.cloudinary.com/v1_1/de6x6wclk/upload", formData).then(
      async (response) => {
        if (response.data) {
            await updateNotification({
            id: "load-data",
            color: "green",
            loading: true,
            title: "Enregistrement en cours...",
            disallowClose: true,
            autoClose: false,
          });
          const res = await dispatch(
            updateFraud({
              _id: data?._id,
              dataToSubmit: {
               ...values,
               file_url: response.data.secure_url,
               action: "closed",
               status: "closed",
            
              },
            })
          );

          if (res.payload) {
            handleClose();

            await dispatch(findSelected(data?._id));

            return showNotification({
              color: "green",
              title: "Réussite",
              message: "Enregistrement réussi!",
              icon: <BsCheck2 size={24} />,
              autoClose: 3000
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
          <DatePicker
            variant="filled"
            size="sm"
            label="Cloture définitive du dossier et archivage  "
            className="textinput"
            description="Date de cloture : "
            style={{ width: "100%" }}
            {...form.getInputProps("date")}
          />
        </div>

        <div className="dates">
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Numéro du Jugement/Arret :"
            style={{ width: "100%" }}
            {...form.getInputProps("jugement_no")}
          />
        </div>

        <div className="dates">
          <FileInput
            variant="filled"
            size="sm"
            style={{ width: "100%" }}
            placeholder="Sélectionner document que vous voulez importer"
            label="Rapport de cloture :"
            ref={fileUrl}
            {...form.getInputProps("file_url")}
            withAsterisk
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
            description="Parlez briévement des paramétres autour de cette cloture."
            placeholder="Parlez briévement..."
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

export default FormArchive;
