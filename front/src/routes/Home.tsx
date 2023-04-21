import { useState, useEffect } from "react";

function Home() {
  const [state, setState] = useState<{
    isLoading: boolean;
    message: string;
  }>({
    isLoading: true,
    message: "",
  });

  useEffect(() => {
    const abortController = new AbortController();
    fetch("/api", {
      signal: abortController.signal,
    })
      .then((res) => res.text())
      .then((data) => {
        setState({
          isLoading: false,
          message: data,
        });
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("fetch aborted");
        } else {
          setState({
            isLoading: false,
            message: "Error",
          });
          throw err;
        }
      });

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div>
      <h1>Home</h1>
      <p>{state.isLoading ? "Loading..." : state.message}</p>
    </div>
  );
}

export default Home;
