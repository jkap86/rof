import React from "react";
import "./TableMain.css";

type ClickHandler = (id: string) => void;

type SetPage = (page: number) => void;

interface TableMainProps {
  type: number;
  headers: { text: string; colspan: number }[];
  data: any[];
  half?: boolean;
  active?: string;
  setActive?: ClickHandler;
  caption?: JSX.Element;
  page?: number;
  setPage?: SetPage;
}

const TableMain: React.FC<TableMainProps> = ({
  type,
  headers,
  data,
  half,
  active,
  setActive,
  caption,
  page,
  setPage,
}) => {
  const body = page ? data.slice((page - 1) * 25, (page - 1) * 25 + 25) : data;

  return (
    <>
      {page ? (
        <div className="page_numbers_wrapper">
          <ol className="page_numbers">
            {Array.from(Array(Math.ceil(data?.length / 25 || 0)).keys()).map(
              (key) => {
                return (
                  <li
                    key={key + 1}
                    className={page === key + 1 ? "active" : ""}
                    onClick={() => setPage && setPage(key + 1)}
                  >
                    {key + 1}
                  </li>
                );
              }
            )}
          </ol>
        </div>
      ) : null}
      <table
        className={
          "main " +
          ((half && "half ") || "") +
          (type === 1 ? "summary" : type === 2 ? "detail" : "")
        }
      >
        <caption>{caption && caption}</caption>
        <thead className="main_heading">
          <tr>
            {headers.map((h) => {
              return (
                <th key={h.text} colSpan={h.colspan} className="main_header">
                  {h.text}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {body.map((row) => {
            return (
              <tr key={row.id}>
                <td
                  colSpan={headers.reduce((acc, cur) => acc + cur.colspan, 0)}
                >
                  <table className="main_content">
                    <tbody>
                      <tr
                        className={active === row.id ? "active" : ""}
                        onClick={() =>
                          setActive &&
                          (active === row.id
                            ? setActive("")
                            : setActive(row.id))
                        }
                      >
                        {row.columns.map(
                          (
                            col: {
                              text: string;
                              colspan: number;
                              classname: string;
                            },
                            index: number
                          ) => {
                            return (
                              <td
                                key={index}
                                colSpan={col.colspan}
                                className="content"
                              >
                                <div>{col.text}</div>
                              </td>
                            );
                          }
                        )}
                      </tr>
                    </tbody>
                    {active === row.id && (
                      <tbody>
                        <tr className="detail">
                          <td
                            colSpan={headers.reduce(
                              (acc, cur) => acc + cur.colspan,
                              0
                            )}
                          >
                            {row.secondaryTable}
                          </td>
                        </tr>
                      </tbody>
                    )}
                  </table>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default TableMain;
