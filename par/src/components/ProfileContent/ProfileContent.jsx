import Image from "next/image";
import styles from "./ProfileContent.module.css";
import cat from "./cat.png";
import { OpenCardProfile } from "../OpenCardProfile/OpenCardProfile";
import {
  AddressContent,
  BonusCardContent,
  PhoneContent,
} from "../OpenCardProfile/cardProfileContent/cardProfileContent";
import { getServerSession } from "next-auth";

export const ProfileContent = async () => {
  const session = await getServerSession();
  return (
    <div className={styles.content}>
      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <div className={styles.panelHello}>
            <i className="ic_Profile" />
            <div>
              <div style={{ display: "flex", gap: "4px" }}>
                <h3>
                  {session?.user.name != null
                    ? session.user.name
                    : "Пользователь"}
                </h3>
                <button
                  style={{
                    border: "none",
                    background: "none",
                    width: "20px",
                    height: "20px",
                  }}
                >
                  <i
                    style={{ color: "#C2D0FB", fontSize: "14px" }}
                    className="ic_Edit"
                  />
                </button>
              </div>
              <p>Добро пожаловать!</p>
            </div>
          </div>
          <div className={styles.catContain}>
            <Image src={cat} width={cat.width / 2} height={cat.height / 2} />
          </div>
        </div>
        <OpenCardProfile
          ic_Name="ic_Ticket"
          text="Бонусная карта"
          sub="от магазина Пармаркет"
        >
          <BonusCardContent />
        </OpenCardProfile>
        <OpenCardProfile
          ic_Name="ic_Location"
          text="Мои адреса"
          sub="Список ваших адресов"
        >
          <AddressContent />
        </OpenCardProfile>
        <OpenCardProfile
          ic_Name="ic_Call"
          text="Номер телефона"
          sub="Список ваших номеров"
        >
          <PhoneContent />
        </OpenCardProfile>
        <div className={styles.socialLnk}>
          <span>Наши соц.сети:</span>
          <div>
            <a
              className={`${styles.Vk} ${styles.socialCard}`}
              href="https://vk.com/par_delivery"
              target="_blank"
            >
              <i className="ic_Vk" />
              <span>вконтакте</span>
            </a>
            <a
              className={`${styles.Tg} ${styles.socialCard}`}
              href="https://t.me/par_delivery"
              target="_blank"
            >
              <i className="ic_Tg" />
              <span>телеграм</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
