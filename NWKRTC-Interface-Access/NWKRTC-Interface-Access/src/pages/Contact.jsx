import { GraduationCap, FolderCode, Info } from "lucide-react";

function Contact() {
  return (
    <section className="section">
      <div className="container narrow">
        <h1 className="page-title">Contact</h1>
        <p className="page-subtitle">Project information</p>

        <div className="card contact-list">
          <div className="contact-item">
            <FolderCode size={26} />
            <div>
              <small>Project name</small>
              <strong>NWKRTC BusTrack</strong>
            </div>
          </div>
          <div className="contact-item">
            <GraduationCap size={26} />
            <div>
              <small>Course</small>
              <strong>BCA, Second Year</strong>
            </div>
          </div>
          <div className="contact-item">
            <Info size={26} />
            <div>
              <small>Student name</small>
              <strong>Your Name Here</strong>
            </div>
          </div>
          <div className="contact-item">
            <Info size={26} />
            <div>
              <small>College</small>
              <strong>Your College Name Here</strong>
            </div>
          </div>
        </div>

        <p className="small-note">
          This website is a student project. It is not the official NWKRTC website.
        </p>
      </div>
    </section>
  );
}

export default Contact;
