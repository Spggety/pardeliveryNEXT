"use client";
import { Dialog } from "@headlessui/react";
import styles from "./ModalPanel.module.css";

export const ModalPanel = (props) => {
  return (
    <Dialog open={props.isOpen} onClose={() => props.setIsOpen(false)}>
      <div className={styles.bg}>
        <Dialog.Panel className={styles.panel}>
          <i style={{color:props.icoColor}} className={props.ico}/>
          <Dialog.Title className={styles.popupHead}>
            {props.title}
          </Dialog.Title>
          {props.children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
