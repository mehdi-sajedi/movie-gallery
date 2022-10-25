import styles from "./CustomCheckbox.module.scss";
import { IFilterData } from "../../../features/movies/movieSlice";

const basePath = "https://image.tmdb.org/t/p/original";

interface CustomCheckboxProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<IFilterData>>;
  id: number;
  name: string;
  group: string;
  img: string;
  state: string;
}

const CustomCheckbox = ({
  formData,
  setFormData,
  id,
  name,
  group,
  state,
  img,
}: CustomCheckboxProps) => {
  const toggleCheckbox = () => {
    let newState;

    if (formData[state].includes(id)) {
      newState = formData[state].filter((x: any) => x !== id);
    } else {
      newState = [...formData[state], id];
    }
    setFormData({
      ...formData,
      [state]: newState,
    });
  };

  return (
    <li className={styles.listItem}>
      <input
        type="checkbox"
        name={group}
        id={name}
        checked={formData[state]?.includes(id)}
        onChange={toggleCheckbox}
        className={formData[state]?.includes(id) ? styles.active : ""}
      />

      <label
        htmlFor={name}
        className={`${
          group === "watch-providers" ? styles.watch : styles.text
        } ${
          formData[state]?.length > 0 && !formData[state]?.includes(id)
            ? styles.fade
            : ""
        }`}
      >
        {group === "watch-providers" ? (
          <img src={`${basePath}${img}`} loading="lazy" alt="" />
        ) : (
          name
        )}
      </label>
    </li>
  );
};

export default CustomCheckbox;