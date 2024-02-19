import {
  Button,
  Divider,
  FileInput,
  MultiSelect,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import React, { useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import { DatePicker, TimeInput } from "@mantine/dates";
import Axios from "axios";
import {
  BsCalendar2,
  BsCheck2,
  BsClock,
  BsPinMap,
  BsXLg,
} from "react-icons/bs";
import { findSelected } from "../../redux/slices/current";
import { updateFraud } from "../../redux/slices/fraud_cases";

const createInvitationSchema = yup.object().shape({
  date_meeting: yup.date().required("champ obligatoire"),
  time_meeting: yup.date().required("champ obligatoire"),
  location: yup.string().required("champ obligatoire"),
  service: yup.array().required("champ obligatoire"),
  file_url: yup.string().optional(),
  observation: yup.string().optional(),
});

function FormInvitation({ status, data, handleClose }) {
  const dispatch = useDispatch();
  const services = useSelector((state) => state.services);

  const [loading, setloading] = useState(false);

  const form = useForm({
    validate: yupResolver(createInvitationSchema),
    initialValues: {
      date_meeting: new Date(),
      time_meeting: new Date(),
      location: "",
      service: "",
      file_url: "",
      observation: "",
    },
  });

  console.log("Errors: ", form.errors);

  const serviceList = !services ? [] : services?.map((obj) => obj.service_name);

  async function handleSubmit(values, e) {
    e.preventDefault();
    setloading(true);

    if (status === "report") {
      const formData = new FormData();
      formData.append("file", values.file_url);
      formData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);

      await showNotification({
        id: "load-data",
        loading: true,
        color: "blue",
        title: "Chargement du fichier en cours...",
        autoClose: false,
        disallowClose: true,
      });

      Axios.post(process.env.REACT_APP_CLOUDINARY_URL, formData).then(
        async (response) => {
          if (response.data) {
            const dataToSubmit = {
              action: "add-invitations",
              date_meeting: values.date_meeting,
              time_meeting: values.time_meeting,
              location: values.location,
              service: values.service,
              observation: values.observation,
              report_url: response.data.secure_url,
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

    if (status === "invite") {
      const res = await dispatch(
        updateFraud({
          _id: data?._id,
          dataToSubmit: { ...values, action: "send-invite" },
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

  return (
    <div style={{ borderTop: "1px solid #eaeaea", marginTop: -8 }}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="dates">
          <DatePicker
            variant="filled"
            size="sm"
            className="textinput"
            description="Date : "
            style={{ width: "49%" }}
            icon={<BsCalendar2 />}
            {...form.getInputProps("date_meeting")}
          />
          <TimeInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Heure : "
            style={{ width: "49%" }}
            icon={<BsClock />}
            {...form.getInputProps("time_meeting")}
          />
        </div>
        <div className="dates">
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Lieu : "
            style={{ width: "100%" }}
            icon={<BsPinMap />}
            {...form.getInputProps("location")}
          />
        </div>
        <div className="dates">
          <MultiSelect
            data={["tous les services membres", ...serviceList]}
            size="sm"
            description="Service(s) invités pour l'instruction du dossier :"
            className="textinput"
            style={{ width: "100%" }}
            {...form.getInputProps("service")}
          />
        </div>
        {status === "report" ? (
          <>
            <div className="dates">
              <FileInput
                variant="filled"
                size="sm"
                style={{ width: "100%" }}
                description="Sélectionner document que vous voulez importer :"
                label="Joindre le P.V. et/ou décision de la reunion "
                {...form.getInputProps("file_url")}
                withAsterisk
              />
            </div>

            <div className="dates">
              <Textarea
                {...form.getInputProps("observation")}
                label="Breve observation: "
                style={{ width: "100%" }}
                variant="filled"
                size="sm"
                className="textinput"
                description="Parlez brievement de la reunion précedente et ce qui y a été discuté."
                autosize
                minRows={2}
                maxRows={4}
              />
            </div>
          </>
        ) : null}

        <Divider style={{ marginTop: 14 }} />

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
    </div>
  );
}

export default FormInvitation;
