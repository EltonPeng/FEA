namespace Board.Models
{
    public class Sticker
    {
        public int Id { get; set; }

        public string Header { get; set; }

        public string Content { get; set; }

        public bool IsChecked { get; set; }
    }
}