let frameId = localStorage.getItem("frame_id");
if (!frameId) {
  frameId = crypto.randomUUID();
  localStorage.setItem("frame_id", frameId);
}
