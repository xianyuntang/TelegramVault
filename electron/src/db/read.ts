import { db } from "./index";

export const listDirectories = async () => {
  const directories: Array<any> = await db.all(
    "SELECT A.id, A.parentId, A.name\n" +
      "FROM directories A\n" +
      "WHERE id == 1\n" +
      "UNION\n" +
      "SELECT A.id, A.parentId, A.name\n" +
      "FROM directories A,\n" +
      "     directories B\n" +
      "WHERE A.parentId == B.id\n" +
      "ORDER BY parentId;\n"
  );

  function buildList(directories:Array<any>){
    const root = { ...directories[0], children: [] };
    function helper(index: number, node: any){
      if (index >= directories.length) {
        return;
      }
      if (directories[index].parentId == node.id) {
        node.children.push({ ...directories[index], children: [] });
      } else {
        for (let i = 0; i < node.children.length; i++) {
          helper(index + 1, node.children[i]);
        }
      }
      helper(index + 1, node);
    }
    helper(1, root);
    return root
  }

  return buildList(directories)
};
