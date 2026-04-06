"use client";
import React, { useEffect, useState } from "react";
import styles from "./cardProfileContent.module.css";
import { useSession } from "next-auth/react";
import { ModalAddAddress } from "@/components/ModalAddAddress/ModalAddAddress";
export const BonusCardContent = (props) => {
  const session = useSession();
  const userId = session.data?.user.id;
  const [card, setCard] = useState();
  const [value, setValue] = useState("");
  const postBonusCard = (userid, promoCard) => {
    const raw = JSON.stringify({
      userid: userid,
      promoCard: promoCard,
    });
    const requestOptions = {
      method: "POST",
      body: raw,
    };
    if (value !== "") {
      fetch(
        `/api/bonuscards?userid=${userId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then(() => {
          getBonusCard();
          setValue("");
        })
        .catch((err) => console.error(err));
    }
  };
  const deleteBonusCard = () => {
    var requestOptions = {
      method: "DELETE",
    };

    fetch(
      `/api/bonuscards?userid=${userId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then(() => getBonusCard())
      .catch((err) => console.error(err));
  };
  const getBonusCard = () => {
    var requestOptions = {
      method: "GET",
    };

    fetch(
      `/api/bonuscards?userid=${userId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => setCard(result.bonusCards[0].promoCard))
      .catch(() => setCard(null));
  };
  useEffect(() => {
    getBonusCard();
  }, []);
  return card !== null ? (
    <div className={styles.RemoveBonusCard}>
      <p>
        {card}
        <i className="ic_Apply-Ring" />
      </p>

      <button onClick={() => deleteBonusCard()}>
        <i className="ic_Delete" />
      </button>
    </div>
  ) : (
    <div className={styles.AddBonusCard}>
      <input
        onChange={(e) => setValue(e.target.value)}
        type="number"
        placeholder="Введите номер телефона/бонусной"
      />
      <ButtonAdd onClick={postBonusCard} value={value} />
    </div>
  );
};


const getAddresses = (setAddresses, userId) => {
  var requestOptions = {
    method: "GET",
  };

  fetch(`/api/addresses?userid=${userId}`, requestOptions)
    .then((response) => response.json())
    .then((result) => setAddresses(result.addresses))
    .catch(() => setAddresses(null));
};




export const AddressContent = () => {
  const [active, setActive] = useState(false);
  const [activeChange, setActiveChange] = useState(false);
  const session = useSession();
  const userId = session.data?.user.id;
  const [addresses, setAddresses] = useState();

  useEffect(() => {
    getAddresses(setAddresses, userId);
  }, [activeChange]);

  return (
    <>
      <div className={styles.AddAddress}>
        <h4>Добавить новый адрес</h4>
        <ButtonAdd onClick={() => setActive(true)} />
      </div>
      <ModalAddAddress
        setActiveChange={setActiveChange}
        userId={userId}
        active={active}
        setActive={setActive}
      />
      {addresses?.map((el) => (
        <AddressList
          key={el._id}
          setActiveChange={setActiveChange}
          userId={userId}
          address={el}
        />
      ))}
    </>
  );
};

const AddressList = ({ userId, address, setActiveChange }) => {
  const id = address;
  const [active, setActive] = useState(false);
  const deleteAddress = () => {
    var requestOptions = {
      method: "DELETE",
    };
    fetch(`/api/addresses?id=${id._id}`, requestOptions)
      .then((response) => response.json())
      .then(() => setActiveChange((v) => !v))
      .catch((err) => console.error(err));
  };
  return (
    <>
      <div className={styles.AddressContain}>
        <div className={styles.аddress}>
          <h4>{address.address}</h4>
          <sub>
            {address.apartment} кв, {address.porch} подъезд, {address.floor}{" "}
            этаж
          </sub>
        </div>
        <div className={styles.CRUDbutton}>
          <button onClick={() => setActive(true)}>
            <i className="ic_Edit" />
          </button>
          <button onClick={() => deleteAddress()}>
            <i className="ic_Delete" />
          </button>
        </div>
      </div>
      <ModalAddAddress
        setActiveChange={setActiveChange}
        address={address}
        userId={userId}
        active={active}
        setActive={setActive}
      />
    </>
  );
};

export const PhoneContent = () => {
  const session = useSession();
  const userId = session.data?.user.id;
  const [card, setCard] = useState();
  const [value, setValue] = useState("");
  const postPhone = (userid, phone) => {
    const raw = JSON.stringify({
      userid: userid,
      phone: phone,
    });
    const requestOptions = {
      method: "POST",
      body: raw,
    };
    if (value !== "") {
      fetch(`/api/phones?userid=${userId}`, requestOptions)
        .then((response) => response.json())
        .then(() => {
          getPhone();
          setValue("");
        })
        .catch((err) => console.error(err));
    }
  };
  const deletePhone = () => {
    var requestOptions = {
      method: "DELETE",
    };

    fetch(`/api/phones?userid=${userId}`, requestOptions)
      .then((response) => response.json())
      .then(() => getPhone())
      .catch((err) => console.error(err));
  };
  const getPhone = () => {
    var requestOptions = {
      method: "GET",
    };

    fetch(`/api/phones?userid=${userId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => setCard(result.phones[0].phone))
      .catch(() => setCard(null));
  };
  useEffect(() => {
    getPhone();
  }, []);
  return card !== null ? (
    <div className={styles.RemoveBonusCard}>
      <p>
        +7{card}
        <i className="ic_Apply-Ring" />
      </p>

      <button onClick={() => deletePhone()}>
        <i className="ic_Delete" />
      </button>
    </div>
  ) : (
    <div className={styles.AddPhone}>
      <div className={styles.inputDiv}>
        <span>+7</span>
        <input
          onChange={(e) => setValue(e.target.value)}
          type="number"
          placeholder="(000) 000 00 00 "
        />
      </div>
      <ButtonAdd onClick={postPhone} value={value} />
    </div>
  );
};

const ButtonAdd = (props) => {
  const session = useSession();
  const userId = session.data.user.id;
  return (
    <button
      onClick={() => props.onClick(userId, props.value)}
      className={styles.ButtonAdd}
    >
      <i className="ic_Plus" />
    </button>
  );
};
