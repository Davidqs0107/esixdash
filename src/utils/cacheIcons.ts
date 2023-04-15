import Icon from "../components/common/Icon";
import { flagLookup } from "../components/common/converters/CountryCodeToFlag";

const cacheIcons = async () => {
  const iconsList = Object.keys(Icon);
  const promises = await iconsList.map((path) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = Icon[path as keyof typeof Icon];
      //@ts-ignore
      img.onload = resolve();
      //@ts-ignore
      img.onerror = reject();
    });
  });

  await Promise.all(promises);
};

const cacheFlags = async () => {
  var promises = [];

  for (let value of flagLookup.values()) {
    promises.push(
      new Promise((resolve, reject) => {
        const path = value;
        if (path !== undefined) {
          const img = new Image();
          img.src = path;
          //@ts-ignore
          img.onload = resolve();
          //@ts-ignore
          img.onerror = reject();
        }
      })
    );
  }

  return Promise.all(promises);
};

export { cacheIcons, cacheFlags };
