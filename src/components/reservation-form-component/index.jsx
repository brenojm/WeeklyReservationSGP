import {
    numberOfDaysSelect,
    positions,
    workshifts,
} from "../../utils/utilArrays";
import t2mLogo from "../../assets/t2m-logo.jpg";
import { Button, Chip, MenuItem, Slider, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { devUrl, getAccessTokenUrl, postUrl } from "../../utils/utilUrls";
import { useEffect, useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pt-br";

import "./styles.css";

import { Col, Container, Form, Row, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { IOSSwitch } from "../../utils/utilsSwitch";
import stringConnection, {
    apiDev,
    apiServer,
} from "../../config/stringConnection";
import { api } from "../../services/api/apiConnection";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const ReservationFormComponent = () => {
    const [email, setEmail] = useState("@t2mlab.com");
    const [accessToken, setAccessToken] = useState("");
    const [position, setPosition] = useState("A1");
    const [workshift, setWorkshift] = useState("Integral");
    const [selectedDays, setSelectedDays] = useState([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
  ]);
    const [dates, setDates] = useState([]);
    const [firstDate, setFirstDate] = useState(new Date());
    const [numberOfWeeks, setNumberOfWeeks] = useState(1);
    const [loadingSender, setLoadingSender] = useState(false);
    const [devMode, setDevMode] = useState(false);
    const [updateByNumberOfWeekDays, setUpdateByNumberOfWeekDays] =
        useState(false);

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    useEffect(() => {
        if (dates.length === 0) {
            const today = new Date();

            const nextWeekdayDates = getNextWeekday(today);
            setDates(nextWeekdayDates);
        } else {
            const nextWeekdayDates = getNextWeekday(firstDate);
            setDates(nextWeekdayDates);
        }
    }, [updateByNumberOfWeekDays]);

    const changeNumberOfWeekDays = (e) => {
        setNumberOfWeeks(e);
        setUpdateByNumberOfWeekDays(!updateByNumberOfWeekDays);
    };

    const selectEmailbyToken = (e) => {
        setAccessToken(e);
        const decodedToken = jwtDecode(e);
        setEmail(decodedToken.unique_name);
    };

    const getNextWeekday = (date) => {
        const weekdays = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        const millisecondsInOneDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds

        const nextDates = [];
        let i = 0;

        //uma semana igual à o numero de dias selecionados
        //uma semana = selectedDays.length+1

        while (nextDates.length < selectedDays.length*numberOfWeeks) {
            const nextDate = new Date(
                date.getTime() + i * millisecondsInOneDay
            );

            if (
                weekdays[nextDate.getDay()] !== "Saturday" &&
                weekdays[nextDate.getDay()] !== "Sunday"
            ) {
                if (selectedDays.includes(weekdays[nextDate.getDay()])) {
                    const day = String(nextDate.getDate()).padStart(2, "0");
                    const month = String(nextDate.getMonth() + 1).padStart(
                        2,
                        "0"
                    );
                    const year = nextDate.getFullYear();
                    const formattedDate = `${year}-${month}-${day}`;

                    nextDates.push(formattedDate);
                }
            }

            i++;
        }

        return nextDates;
    };

    const fetchData = async () => {
        setLoadingSender(true);
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        for (let i = 0; i < selectedDays.length*numberOfWeeks; i++) {
            try {
                const response = await axios.post(
                    devMode ? devUrl : postUrl,
                    {
                        userEmail: email,
                        reservationDate: `${dates[i]}T09:00:00.485Z`,
                        positionName: position,
                        workshift: workshift,
                    },
                    {
                        headers: headers,
                    }
                );
                console.log(response);
                if (response.status == 201) {
                    toast.success(
                        `Reservation: ${response.data.reservationDate} ${response.statusText}`
                    );
                }
            } catch (error) {
                toast.error(
                    "Erro na requisição: " +
                        (error.response?.data === undefined
                            ? "Dia inválido"
                            : error.response.data.message)
                );
            }
        }
        setLoadingSender(false);
    };

    const ParseDateToShow = (dataStr) => {
        const meses = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        const partesData = dataStr.split("-");
        const dia = partesData[2];
        const mes = meses[parseInt(partesData[1]) - 1];

        return `${mes} ${dia}`;
    };

    const valueText = (value) => {
        return `${value} Days`;
    };

    const newDate = (dateTest) => {
        const dataEscolhida = new Date(dateTest);
        setFirstDate(dataEscolhida);
        setUpdateByNumberOfWeekDays(!updateByNumberOfWeekDays);
    };

    const handleDayClick = (day) => {
        
        setSelectedDays((prevDays) => {
            if (prevDays.includes(day)) {
                return prevDays.filter((d) => d !== day);
            } else {
                return [...prevDays, day];
            }
        });
        setUpdateByNumberOfWeekDays(!updateByNumberOfWeekDays);
    };

    return (
        <>
            <Container>
                <Row className="style-for-row">
                    <Col>
                        <a
                            href="https://www.instagram.com/test2market/"
                            className="logo align-center"
                            target="_blank"
                        >
                            <img src={t2mLogo} alt="T2M logo" />
                        </a>
                    </Col>
                    <Col className="align-center">
                        <h1>Weekly Reservation SGP</h1>
                    </Col>
                </Row>

                <div>
                    <Row className="style-for-token-top">
                        <TextField
                            id="outlined-basic"
                            label="Access Token"
                            variant="outlined"
                            value={accessToken}
                            onChange={(e) => selectEmailbyToken(e.target.value)}
                        />
                    </Row>
                    <Row className="style-for-token-bottom">
                        <Button
                            variant="contained"
                            target="_blank"
                            href={getAccessTokenUrl}
                        >
                            Get Access Token
                        </Button>
                    </Row>
                </div>

                <Row className="style-for-row">
                    <TextField
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        value={email}
                        disabled
                    />
                </Row>

                <Row className="style-for-row">
                    <Col sm>
                        <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            adapterLocale="pt-br"
                        >
                            <DemoContainer components={["DatePicker"]}>
                                <DatePicker
                                    label="Initial Date"
                                    defaultValue={dayjs(new Date())}
                                    onChange={(e) => newDate(e.$d)}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Col>
                    <Col sm>
                        <div className="align-center">
                            <TextField
                                id="outlined-select-currency"
                                select
                                label="Position"
                                defaultValue="A1"
                                helperText="Please select your position"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                            >
                                {positions.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                    </Col>
                    <Col sm>
                        <div className="align-center">
                            <TextField
                                id="outlined-select-currency"
                                select
                                label="Workshift"
                                defaultValue="Integral"
                                helperText="Please select your workshift"
                                value={workshift}
                                onChange={(e) => setWorkshift(e.target.value)}
                            >
                                {workshifts.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                    </Col>
                </Row>

                <Row className="style-for-row">
                    {days.map((day) => (
                        <Col key={day}>
                            <MenuItem
                                value={day}
                                onClick={() => handleDayClick(day)}
                                style={{
                                    backgroundColor: selectedDays.includes(day)
                                        ? "#1976D2"
                                        : "",
                                    color: selectedDays.includes(day)
                                        ? "white"
                                        : "",
                                }}
                            >
                                {day}
                            </MenuItem>
                        </Col>
                    ))}
                </Row>

                <Row className="style-for-row">
                    <Slider
                        aria-label="Always visible"
                        defaultValue={1}
                        getAriaValueText={valueText}
                        step={1}
                        marks={numberOfDaysSelect}
                        valueLabelDisplay="on"
                        max={4}
                        min={1}
                        value={numberOfWeeks}
                        onChange={(e) => changeNumberOfWeekDays(e.target.value)}
                    />
                </Row>

                <Row className="style-for-row">
                    {dates.length < 0 ? (
                        <></>
                    ) : (
                        dates.map((date, index) => (
                            <Col key={index}>
                                <Chip
                                    label={ParseDateToShow(date)}
                                    variant="outlined"
                                />
                            </Col>
                        ))
                    )}
                </Row>

                <Row className="style-for-row">
                    <Button
                        variant="contained"
                        endIcon={!loadingSender && <AiOutlineSend />}
                        disabled={loadingSender}
                        onClick={() => fetchData()}
                    >
                        {loadingSender ? (
                            <>
                                Sending... <Spinner animation="grow" />
                            </>
                        ) : (
                            <>Send</>
                        )}
                    </Button>
                </Row>
                <Row>
                    <p className="align-center">
                        Click on the T2M logo to learn more
                    </p>
                </Row>
                <Row className="style-for-row align-center">
                    <Col>
                        <IOSSwitch
                            sx={{ m: 1 }}
                            value={devMode}
                            onChange={() => setDevMode(!devMode)}
                        />

                        <Chip color="success" label="Dev Server" />
                    </Col>
                </Row>
            </Container>
        </>
    );
};
