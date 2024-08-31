import styles from './footer.module.scss'
import {Montserrat} from "next/font/google";
import MenuComponent from "@/components/foooter/menu/Menu";

const montserrat = Montserrat({subsets: ['latin'],})

export default function Footer() {
    return (
        <div className={styles.footer__contrainer}>
            <MenuComponent></MenuComponent>
            <div className={`${styles.footer__text} ${montserrat.className}`}>Powered by </div>
        </div>
    );
}