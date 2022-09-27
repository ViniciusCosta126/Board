import Head from "../../../node_modules/next/head";
import styles from "./style.module.scss";
import {
  FiPlus,
  FiCalendar,
  FiEdit2,
  FiTrash,
  FiClock,
  FiX,
} from "react-icons/fi";
import SupportButton from "../../components/SupportButton/index";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useState, FormEvent } from "react";
import firebase from "../../services/firebaseConnection";
import { format,formatDistance } from "date-fns";
import {ptBR} from 'date-fns/locale'
import Link from "next/link";

type TaskList = {
  id: string;
  created: string | Date;
  createdFormated?: string;
  tarefa: string;
  userId: string;
  name: string;
};

interface BoardProps {
  user: {
    id: string;
    name: string;
    vip: boolean;
    lastDonate: string | Date;
  };
  data: string;
}

export default function Board({ user, data }: BoardProps) {
  const [input, setInput] = useState("");
  const [taskList, setTaskList] = useState<TaskList[]>(JSON.parse(data));
  const [taskEdit, setTaskEdit] = useState<TaskList | null>(null);

  async function handleAddTask(e: FormEvent) {
    e.preventDefault();
    if (input === "") {
      alert("Escreva alguma tarefa");
      return;
    }
    if (taskEdit) {
      await firebase
        .firestore()
        .collection("tarefas")
        .doc(taskEdit.id)
        .update({
          tarefa: input,
        })
        .then(() => {
          let data = taskList;
          let taskIndex = taskList.findIndex((item) => item.id === taskEdit.id);
          data[taskIndex].tarefa = input;
          setTaskList(data);
          setTaskEdit(null);
          setInput("");
        })
        .catch((err) => {
          console.log("Deu erro: ", err);
        });
      return;
    }
    await firebase
      .firestore()
      .collection("tarefas")
      .add({
        created: new Date(),
        tarefa: input,
        userId: user.id,
        name: user.name,
      })
      .then((doc) => {
        console.log("Cadastrado com sucesso");
        let data = {
          id: doc.id,
          created: new Date(),
          createdFormated: format(new Date(), "dd MMMM yyyy"),
          tarefa: input,
          userId: user.id,
          name: user.name,
        };
        setTaskList([...taskList, data]);
        setInput("");
      })
      .catch((err) => {
        console.log("erro ao cadastrar: ", err);
      });
  }
  async function handleDelete(id: string) {
    await firebase
      .firestore()
      .collection("tarefas")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Deletado com sucesso");
        let taskDeleted = taskList.filter((task) => {
          return task.id !== id;
        });
        setTaskList(taskDeleted);
      })
      .catch((err) => {
        console.log("Deu erro: ", err);
      });
  }
  async function handleEditTask(task: TaskList) {
    setTaskEdit(task);
    setInput(task.tarefa);
  }
  function handleCancelEdit() {
    setTaskEdit(null);
    setInput("");
  }
  return (
    <>
      <Head>
        <title>Minhas Tarefas - board</title>
      </Head>
      <main className={styles.container}>
        {taskEdit && (
          <span className={styles.warning}>
            <button onClick={handleCancelEdit}>
              <FiX size={30} color="#ff3636" />
            </button>{" "}
            Voce esta editando uma task
          </span>
        )}
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Digite sua tarefa"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">
            <FiPlus size={25} color="#17181f" />
          </button>
        </form>
        <h1>
          Você tem {taskList.length}{" "}
          {taskList.length > 1 ? "tarefas" : "tarefa"}!
        </h1>
        <section>
          {taskList.map((task) => (
            <article key={task.id} className={styles.taskList}>
              <Link href={`/board/${task.id}`}>
                <p>{task.tarefa}</p>
              </Link>
              <div className={styles.actions}>
                <div>
                  <div>
                    <FiCalendar size={20} color="#ffb800" />
                    <time>{task.createdFormated}</time>
                  </div>
                  {user.vip && (
                    <button onClick={() => handleEditTask(task)}>
                      <FiEdit2 size={20} color="#fff" />
                      <span>Editar</span>
                    </button>
                  )}
                </div>

                <button onClick={() => handleDelete(task.id)}>
                  <FiTrash size={20} color="#ff3636" />
                  <span>Excluir</span>
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
      {user.vip && (
        <div className={styles.vipContainer}>
          <h3>Obrigado por apoiar este projeto</h3>
          <div>
            <FiClock size={28} color="#fff" />
            <time>Ultima doação foi a {formatDistance(new Date(user.lastDonate),new Date(),{locale:ptBR})}</time>
          </div>
        </div>
      )}

      <SupportButton />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (req) => {
  const session = await getSession(req);
  if (!session?.id) {
    //Se nao estiver logado, vai dar redirect
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const tasks = await firebase
    .firestore()
    .collection("tarefas")
    .where("userId", "==", session?.id)
    .orderBy("created", "asc")
    .get();

  const data = JSON.stringify(
    tasks.docs.map((task) => {
      return {
        id: task.id,
        createdFormated: format(task.data().created.toDate(), "dd MMMM yyyy"),
        ...task.data(),
      };
    })
  );

  const user = {
    name: session?.user.name,
    id: session?.id,
    vip: session?.vip,
    lastDonate: session?.lastDonate,
  };

  return {
    props: {
      user,
      data,
    },
  };
};
