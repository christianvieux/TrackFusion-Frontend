export default function () {
  return (
    <table className="track-list-table">
      <thead>
        <tr className="track-list-table-columns">
          <th>
            <h4>NAME</h4>
          </th>
          <th>
            <h4>OWNER</h4>
          </th>
          <th>
            <h4>DATE</h4>
          </th>
          <th>
            <h4>SIZE</h4>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div className="track-list-table-name">
              <img className="track-pic" src="./images/pfp-pic.jpg"></img>
              <h5>First_Track</h5>
            </div>
          </td>
          <td>
            <h5>John Doe</h5>
          </td>
          <td>
            <h5>2024-05-19</h5>
          </td>
          <td>
            <h5>1 Mb</h5>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
