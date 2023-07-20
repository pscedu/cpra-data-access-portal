import { h } from "preact";
import { useLayoutEffect, useRef } from "preact/hooks";

const StaticPage = ({ contentUrl }) => {
  const container = useRef(null);

  useLayoutEffect(() => {
    (async () => {
      if (container.current) {
        const res = await fetch(contentUrl);
        const text = await res.text();
        container.current.innerHTML = text;
      }
    })();
  }, [contentUrl]);

  return <div ref={container} />;
};

export default StaticPage;
