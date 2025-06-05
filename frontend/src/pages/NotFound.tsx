import {motion} from "motion/react"

const NotFound = () => {
    return (
      <main>
        <div className={"size-screen flex-center bg-primary"}>
          <motion.div className={"flex flex-col gap-4"}>
            <span className={"mx-auto"}>
              <motion.span initial={{
                opacity: 0,
                y: 50,
              }} animate={{
                opacity: 1,
                y: 0,
              }}>
                <img src={"/404.svg"} alt={"404"} className={"h-40"} />
              </motion.span>
            </span>
            <motion.h1
              initial={{
                opacity: 0,
                y: 50,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className={"text-center text-2xl font-bold text-tertiary"}
            >
              404 Not Found
            </motion.h1>
          </motion.div>
        </div>
      </main>
    );
}
export default NotFound
